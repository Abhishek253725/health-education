import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock, AlertCircle, Download, Filter } from 'lucide-react';
import { attendanceAPI } from '../services/api';
import './AttendanceSection.css';

const AttendanceSection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [filterClass, setFilterClass] = useState('all');
  const [showStatistics, setShowStatistics] = useState(false);
  const [statistics, setStatistics] = useState(null);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getAttendanceByDate(selectedDate);
      setAttendanceData(response.data);

      // Initialize attendance records from existing data
      const records = {};
      response.data.marked.forEach(record => {
        records[record.student._id] = record.status;
      });
      setAttendanceRecords(records);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const fetchStatistics = async () => {
    try {
      const response = await attendanceAPI.getStatistics({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      
      const attendanceArray = Object.entries(attendanceRecords).map(([studentId, status]) => ({
        studentId,
        status,
        notes: ''
      }));

      await attendanceAPI.markBulkAttendance({
        attendanceRecords: attendanceArray,
        date: selectedDate,
        subject: 'General'
      });

      alert('Attendance saved successfully!');
      fetchAttendance();
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAll = (status) => {
    if (!attendanceData) return;
    
    const allStudents = [...attendanceData.marked.map(a => a.student), ...attendanceData.unmarked];
    const newRecords = {};
    allStudents.forEach(student => {
      newRecords[student._id] = status;
    });
    setAttendanceRecords(newRecords);
  };

  const getFilteredStudents = () => {
    if (!attendanceData) return [];
    
    const allStudents = [
      ...attendanceData.marked.map(a => ({ ...a.student, currentStatus: attendanceRecords[a.student._id] || a.status })),
      ...attendanceData.unmarked.map(s => ({ ...s, currentStatus: attendanceRecords[s._id] || null }))
    ];

    if (filterClass === 'all') return allStudents;
    return allStudents.filter(s => s.class === filterClass);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#00C9A7';
      case 'absent': return '#FF6B6B';
      case 'late': return '#FFD166';
      case 'excused': return '#6C63FF';
      default: return '#94A3B8';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle size={18} />;
      case 'absent': return <XCircle size={18} />;
      case 'late': return <Clock size={18} />;
      case 'excused': return <AlertCircle size={18} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="attendance-loading">
        <div className="spinner"></div>
        <p>Loading attendance...</p>
      </div>
    );
  }

  const filteredStudents = getFilteredStudents();
  const classes = attendanceData ? [...new Set([...attendanceData.marked.map(a => a.student.class), ...attendanceData.unmarked.map(s => s.class)])].filter(Boolean) : [];

  return (
    <div className="attendance-section">
      <div className="attendance-header">
        <div className="header-left">
          <h2>
            <Users size={24} />
            Student Attendance
          </h2>
          <p>Mark and track daily attendance</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-statistics"
            onClick={() => {
              setShowStatistics(!showStatistics);
              if (!statistics) fetchStatistics();
            }}
          >
            <Download size={16} />
            {showStatistics ? 'Hide' : 'View'} Statistics
          </button>
        </div>
      </div>

      {/* Date and Controls */}
      <div className="attendance-controls">
        <div className="date-selector">
          <Calendar size={20} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="filter-controls">
          <Filter size={16} />
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="quick-actions">
          <button onClick={() => handleMarkAll('present')} className="btn-quick present">
            <CheckCircle size={16} />
            Mark All Present
          </button>
          <button onClick={() => handleMarkAll('absent')} className="btn-quick absent">
            <XCircle size={16} />
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {attendanceData && (
        <div className="attendance-summary">
          <div className="summary-card total">
            <div className="summary-icon">
              <Users />
            </div>
            <div className="summary-info">
              <span className="summary-label">Total Students</span>
              <span className="summary-value">{attendanceData.summary.total}</span>
            </div>
          </div>

          <div className="summary-card present">
            <div className="summary-icon">
              <CheckCircle />
            </div>
            <div className="summary-info">
              <span className="summary-label">Present</span>
              <span className="summary-value">{attendanceData.summary.present}</span>
            </div>
          </div>

          <div className="summary-card absent">
            <div className="summary-icon">
              <XCircle />
            </div>
            <div className="summary-info">
              <span className="summary-label">Absent</span>
              <span className="summary-value">{attendanceData.summary.absent}</span>
            </div>
          </div>

          <div className="summary-card late">
            <div className="summary-icon">
              <Clock />
            </div>
            <div className="summary-info">
              <span className="summary-label">Late</span>
              <span className="summary-value">{attendanceData.summary.late}</span>
            </div>
          </div>

          <div className="summary-card unmarked">
            <div className="summary-icon">
              <AlertCircle />
            </div>
            <div className="summary-info">
              <span className="summary-label">Not Marked</span>
              <span className="summary-value">{attendanceData.summary.unmarked}</span>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      {showStatistics && statistics && (
        <div className="statistics-panel">
          <h3>Attendance Statistics (Last 30 Days)</h3>
          <div className="stats-overview">
            <div className="stat-item">
              <span>Average Attendance Rate</span>
              <strong>{statistics.overall.averageAttendanceRate}%</strong>
            </div>
            <div className="stat-item">
              <span>Total Records</span>
              <strong>{statistics.overall.totalRecords}</strong>
            </div>
          </div>

          <div className="students-stats-list">
            <h4>Students Needing Attention</h4>
            {statistics.statistics.slice(0, 5).map((stat, index) => (
              <div key={index} className="student-stat-card">
                <div className="student-stat-info">
                  <strong>{stat.student.name}</strong>
                  <span>{stat.student.class}</span>
                </div>
                <div className="student-stat-data">
                  <span className="attendance-rate" style={{ color: parseFloat(stat.attendanceRate) < 75 ? '#FF6B6B' : '#FFD166' }}>
                    {stat.attendanceRate}%
                  </span>
                  <span className="stat-details">
                    P: {stat.present} | A: {stat.absent} | L: {stat.late}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Class</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const currentStatus = attendanceRecords[student._id];
              return (
                <tr key={student._id} className={currentStatus ? `status-${currentStatus}` : ''}>
                  <td>{student.studentId || 'N/A'}</td>
                  <td className="student-name">{student.name}</td>
                  <td>{student.class || 'Not Set'}</td>
                  <td>
                    {currentStatus && (
                      <span className="status-badge" style={{ background: getStatusColor(currentStatus) }}>
                        {getStatusIcon(currentStatus)}
                        {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                      </span>
                    )}
                    {!currentStatus && <span className="status-badge unmarked">Not Marked</span>}
                  </td>
                  <td>
                    <div className="status-buttons">
                      <button
                        className={`status-btn present ${currentStatus === 'present' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(student._id, 'present')}
                        title="Present"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        className={`status-btn absent ${currentStatus === 'absent' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(student._id, 'absent')}
                        title="Absent"
                      >
                        <XCircle size={16} />
                      </button>
                      <button
                        className={`status-btn late ${currentStatus === 'late' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(student._id, 'late')}
                        title="Late"
                      >
                        <Clock size={16} />
                      </button>
                      <button
                        className={`status-btn excused ${currentStatus === 'excused' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(student._id, 'excused')}
                        title="Excused"
                      >
                        <AlertCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="no-students">
            <Users size={48} />
            <p>No students found</p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="attendance-footer">
        <button
          className="btn-save-attendance"
          onClick={handleSaveAttendance}
          disabled={saving || Object.keys(attendanceRecords).length === 0}
        >
          {saving ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>
    </div>
  );
};

export default AttendanceSection;
