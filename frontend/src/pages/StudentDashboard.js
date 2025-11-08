import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  Brain, Heart, TrendingUp, Award, AlertCircle, CheckCircle,
  Activity, Moon, Zap, Download, Calendar, UserCheck
} from 'lucide-react';
import { quizAPI, healthAPI, analyticsAPI, aiAPI, attendanceAPI } from '../services/api';
import './StudentDashboard.css';
import './AttendanceStyles.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StudentDashboard = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [healthData, setHealthData] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch analytics
      const analyticsRes = await analyticsAPI.getStudentAnalytics(user.id);
      setAnalytics(analyticsRes.data);

      // Fetch health data
      const healthRes = await healthAPI.getHealthData(user.id, 7);
      setHealthData(healthRes.data.healthData);

      // Fetch quizzes
      const quizzesRes = await quizAPI.getAll();
      setQuizzes(quizzesRes.data.quizzes);

      // Fetch attendance data (last 30 days)
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const attendanceRes = await attendanceAPI.getStudentAttendance(user.id, {
        startDate: startDate.toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      });
      setAttendanceData(attendanceRes.data);

      // Get AI insights
      if (analyticsRes.data.performance && healthRes.data.healthData.length > 0) {
        const latestHealth = healthRes.data.healthData[0];
        const aiRes = await aiAPI.analyze({
          sleepHours: latestHealth.sleepHours,
          stressLevel: latestHealth.stressLevel,
          heartRate: latestHealth.heartRate,
          recentScores: analyticsRes.data.performance.recentAttempts.map(a => a.percentage)
        });
        setAiInsights(aiRes.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateHealthData = async () => {
    try {
      await healthAPI.simulateData(user.id);
      fetchDashboardData();
    } catch (error) {
      console.error('Error simulating health data:', error);
    }
  };

  const downloadReport = () => {
    if (!analytics) {
      alert('No data available to download');
      return;
    }

    const reportContent = `
EduHealth Nexus - Personal Progress Report
==========================================
Generated: ${new Date().toLocaleDateString()}

STUDENT INFORMATION
-------------------
Name: ${user.name}
Email: ${user.email}
Role: Student

ACADEMIC PERFORMANCE
--------------------
Average Score: ${analytics?.performance?.avgScore || 0}%
Total Quizzes Completed: ${analytics?.performance?.totalQuizzes || 0}
Best Score: ${analytics?.performance?.bestScore || 0}%

Recent Quiz Performance:
${analytics?.performance?.recentAttempts?.slice(0, 5).map((attempt, i) => 
  `${i + 1}. ${attempt.quiz?.title || 'Quiz'}: ${attempt.percentage}% (${new Date(attempt.completedAt).toLocaleDateString()})`
).join('\n') || 'No recent quizzes'}

HEALTH METRICS
--------------
Average Sleep: ${analytics?.health?.avgSleep || 0} hours/night
Average Stress Level: ${analytics?.health?.avgStress || 0}/10
Average Heart Rate: ${analytics?.health?.avgHeartRate || 0} bpm

ATTENDANCE
----------
Attendance Rate: ${attendanceData?.summary?.attendanceRate || 0}%
Present Days: ${attendanceData?.summary?.present || 0}
Absent Days: ${attendanceData?.summary?.absent || 0}
Late Days: ${attendanceData?.summary?.late || 0}

RECOMMENDATIONS
---------------
${analytics?.health?.avgSleep < 7 ? '⚠ Sleep: Try to get 7-9 hours of sleep for better performance\n' : ''}
${analytics?.health?.avgStress > 6 ? '⚠ Stress: Consider stress management techniques (meditation, exercise)\n' : ''}
${analytics?.performance?.avgScore < 70 ? '⚠ Academic: Focus on improving study habits and seek help when needed\n' : ''}
${analytics?.performance?.avgScore >= 80 ? '✓ Academic: Great job! Keep up the excellent work!\n' : ''}
${analytics?.health?.avgSleep >= 7 && analytics?.health?.avgSleep <= 9 ? '✓ Sleep: Excellent sleep habits!\n' : ''}
${attendanceData?.summary?.attendanceRate >= 90 ? '✓ Attendance: Outstanding attendance record!\n' : ''}
${attendanceData?.summary?.attendanceRate < 75 ? '⚠ Attendance: Improve attendance for better academic success\n' : ''}

==========================================
Report generated by EduHealth Nexus
For support, contact: support@eduhealth.com
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `My_Progress_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Prepare chart data
  const performanceChartData = {
    labels: analytics?.performance?.recentAttempts?.slice(0, 7).reverse().map((_, i) => `Quiz ${i + 1}`) || [],
    datasets: [
      {
        label: 'Quiz Scores',
        data: analytics?.performance?.recentAttempts?.slice(0, 7).reverse().map(a => a.percentage) || [],
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const healthChartData = {
    labels: healthData.slice(0, 7).reverse().map((_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Sleep Hours',
        data: healthData.slice(0, 7).reverse().map(h => h.sleepHours),
        borderColor: '#00C9A7',
        backgroundColor: 'rgba(0, 201, 167, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Stress Level',
        data: healthData.slice(0, 7).reverse().map(h => h.stressLevel),
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const healthStatusData = {
    labels: ['Excellent', 'Needs Improvement'],
    datasets: [
      {
        data: [aiInsights?.healthStatus?.score || 75, 100 - (aiInsights?.healthStatus?.score || 75)],
        backgroundColor: ['#00C9A7', '#E2E8F0'],
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user.name}! 👋</h1>
          <p>Here's your academic and health overview</p>
        </div>
        <div className="header-buttons">
          <button onClick={downloadReport} className="btn-download">
            <Download size={18} />
            Download Report
          </button>
          <button onClick={simulateHealthData} className="btn-simulate">
            <Activity size={18} />
            Simulate Health Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6C63FF, #00C9A7)' }}>
            <Award />
          </div>
          <div className="stat-content">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{analytics?.performance?.avgScore || 0}%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00C9A7, #FFD166)' }}>
            <CheckCircle />
          </div>
          <div className="stat-content">
            <span className="stat-label">Quizzes Completed</span>
            <span className="stat-value">{analytics?.performance?.totalQuizzes || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FFD166, #FF6B6B)' }}>
            <Moon />
          </div>
          <div className="stat-content">
            <span className="stat-label">Avg Sleep</span>
            <span className="stat-value">{analytics?.health?.avgSleep || 0}h</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FF6B6B, #6C63FF)' }}>
            <Zap />
          </div>
          <div className="stat-content">
            <span className="stat-label">Stress Level</span>
            <span className="stat-value">{analytics?.health?.avgStress || 0}/10</span>
          </div>
        </div>

        <div className="stat-card attendance-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00C9A7, #6C63FF)' }}>
            <UserCheck />
          </div>
          <div className="stat-content">
            <span className="stat-label">Attendance Rate</span>
            <span className="stat-value">{attendanceData?.summary?.attendanceRate || 0}%</span>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {aiInsights && (
        <div className="ai-insights-section">
          <h2 className="section-title">
            <Brain />
            AI-Powered Insights
          </h2>
          <div className="insights-grid">
            <div className="insight-card prediction">
              <h3>Performance Prediction</h3>
              <div className="prediction-score">
                {aiInsights.prediction.expectedScore}%
              </div>
              <p className="prediction-category">{aiInsights.prediction.performanceCategory}</p>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill" 
                  style={{ width: `${aiInsights.prediction.confidence}%` }}
                ></div>
              </div>
              <span className="confidence-label">{aiInsights.prediction.confidence}% Confidence</span>
            </div>

            <div className="insight-card health-status">
              <h3>Health Status</h3>
              <div className="health-score-circle">
                <Doughnut 
                  data={healthStatusData} 
                  options={{
                    cutout: '70%',
                    plugins: { legend: { display: false } }
                  }}
                />
                <div className="health-score-overlay">
                  <span className="score-value">{aiInsights.healthStatus.score}</span>
                  <span className="score-label">Score</span>
                </div>
              </div>
              <p className="health-status-text" style={{ color: aiInsights.healthStatus.color }}>
                {aiInsights.healthStatus.status}
              </p>
            </div>
          </div>

          {aiInsights.insights && aiInsights.insights.length > 0 && (
            <div className="insights-list">
              <h3>Key Insights</h3>
              {aiInsights.insights.map((insight, index) => (
                <div key={index} className={`insight-item ${insight.type}`}>
                  <AlertCircle size={20} />
                  <div>
                    <strong>{insight.category}:</strong> {insight.message}
                    <span className="impact-badge">{insight.impact} Impact</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
            <div className="recommendations-section">
              <h3>Personalized Recommendations</h3>
              <div className="recommendations-grid">
                {aiInsights.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <div className="rec-header">
                      <span className="rec-category">{rec.category}</span>
                      <span className={`rec-priority ${rec.priority.toLowerCase()}`}>
                        {rec.priority} Priority
                      </span>
                    </div>
                    <h4>{rec.action}</h4>
                    <ul>
                      {rec.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Attendance Details Section */}
      {attendanceData && (
        <div className="attendance-details-section">
          <h2 className="section-title">
            <Calendar />
            Attendance Overview (Last 30 Days)
          </h2>
          
          <div className="attendance-summary-cards">
            <div className="attendance-summary-card present">
              <div className="summary-icon">
                <CheckCircle />
              </div>
              <div className="summary-content">
                <span className="summary-label">Present</span>
                <span className="summary-value">{attendanceData.summary.present}</span>
              </div>
            </div>

            <div className="attendance-summary-card absent">
              <div className="summary-icon">
                <AlertCircle />
              </div>
              <div className="summary-content">
                <span className="summary-label">Absent</span>
                <span className="summary-value">{attendanceData.summary.absent}</span>
              </div>
            </div>

            <div className="attendance-summary-card late">
              <div className="summary-icon">
                <Activity />
              </div>
              <div className="summary-content">
                <span className="summary-label">Late</span>
                <span className="summary-value">{attendanceData.summary.late}</span>
              </div>
            </div>

            <div className="attendance-summary-card total">
              <div className="summary-icon">
                <UserCheck />
              </div>
              <div className="summary-content">
                <span className="summary-label">Total Days</span>
                <span className="summary-value">{attendanceData.summary.total}</span>
              </div>
            </div>
          </div>

          {attendanceData.summary.attendanceRate < 75 && (
            <div className="attendance-alert">
              <AlertCircle size={20} />
              <div>
                <strong>Attendance Alert:</strong> Your attendance rate is below 75%. 
                Regular attendance is important for academic success.
              </div>
            </div>
          )}

          {attendanceData.records && attendanceData.records.length > 0 && (
            <div className="recent-attendance">
              <h3>Recent Attendance Records</h3>
              <div className="attendance-timeline">
                {attendanceData.records.slice(0, 10).map((record, index) => (
                  <div key={index} className={`attendance-record ${record.status}`}>
                    <div className="record-date">
                      {new Date(record.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="record-status">
                      {record.status === 'present' && <CheckCircle size={16} />}
                      {record.status === 'absent' && <AlertCircle size={16} />}
                      {record.status === 'late' && <Activity size={16} />}
                      {record.status === 'excused' && <CheckCircle size={16} />}
                      <span>{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span>
                    </div>
                    {record.notes && <div className="record-notes">{record.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>
            <TrendingUp size={20} />
            Academic Performance Trend
          </h3>
          <Line 
            data={performanceChartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }}
          />
        </div>

        <div className="chart-card">
          <h3>
            <Heart size={20} />
            Health Metrics (Last 7 Days)
          </h3>
          <Line 
            data={healthChartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' }
              }
            }}
          />
        </div>
      </div>

      {/* Available Quizzes */}
      <div className="quizzes-section">
        <h2 className="section-title">Available Quizzes</h2>
        <div className="quizzes-grid">
          {quizzes.slice(0, 6).map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <div className="quiz-header">
                <h4>{quiz.title}</h4>
                {quiz.attempted && (
                  <span className="quiz-badge completed">
                    <CheckCircle size={14} />
                    Completed
                  </span>
                )}
              </div>
              <p className="quiz-subject">{quiz.subject}</p>
              <div className="quiz-meta">
                <span>{quiz.questions.length} Questions</span>
                <span>{quiz.duration} min</span>
              </div>
              {quiz.lastScore && (
                <div className="quiz-score">Last Score: {quiz.lastScore}%</div>
              )}
              <button className="btn-quiz">
                {quiz.attempted ? 'Retake Quiz' : 'Start Quiz'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
