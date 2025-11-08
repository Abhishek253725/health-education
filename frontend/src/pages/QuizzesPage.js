import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, Award, CheckCircle, Play } from 'lucide-react';
import { quizAPI } from '../services/api';
import './QuizzesPage.css';

const QuizzesPage = ({ user }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizStarted]);

  const fetchQuizzes = async () => {
    try {
      const res = await quizAPI.getAll();
      setQuizzes(res.data.quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers(new Array(quiz.questions.length).fill(null));
    setTimeLeft(quiz.duration * 60);
    setQuizStarted(true);
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const attemptData = {
        answers: answers.map((selectedAnswer, index) => ({
          selectedAnswer: selectedAnswer !== null ? selectedAnswer : 0
        })),
        timeTaken: (selectedQuiz.duration * 60) - timeLeft
      };

      const res = await quizAPI.submitAttempt(selectedQuiz._id, attemptData);
      setResult(res.data.attempt);
      setQuizCompleted(true);
      setQuizStarted(false);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading quizzes...</p>
      </div>
    );
  }

  if (quizCompleted && result) {
    return (
      <div className="quiz-result-page">
        <div className="result-container">
          <div className="result-icon">
            {result.percentage >= 60 ? '🎉' : '📚'}
          </div>
          <h1>Quiz Completed!</h1>
          <div className="result-score">
            <span className="score-value">{result.percentage}%</span>
            <span className="score-label">Your Score</span>
          </div>
          <div className="result-stats">
            <div className="result-stat">
              <span className="stat-label">Correct Answers</span>
              <span className="stat-value">{result.correctAnswers}/{result.totalQuestions}</span>
            </div>
            <div className="result-stat">
              <span className="stat-label">Points Earned</span>
              <span className="stat-value">{result.score}</span>
            </div>
          </div>
          <div className="result-message">
            {result.percentage >= 80 && <p className="excellent">Excellent work! Keep it up! 🌟</p>}
            {result.percentage >= 60 && result.percentage < 80 && <p className="good">Good job! Room for improvement! 👍</p>}
            {result.percentage < 60 && <p className="needs-work">Keep practicing! You'll do better next time! 💪</p>}
          </div>
          <div className="result-actions">
            <button onClick={() => {
              setSelectedQuiz(null);
              setQuizCompleted(false);
              setResult(null);
            }} className="btn-primary">
              Back to Quizzes
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-secondary">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizStarted && selectedQuiz) {
    const question = selectedQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;

    return (
      <div className="quiz-taking-page">
        <div className="quiz-header">
          <div className="quiz-info">
            <h2>{selectedQuiz.title}</h2>
            <p>Question {currentQuestion + 1} of {selectedQuiz.questions.length}</p>
          </div>
          <div className="quiz-timer">
            <Clock size={20} />
            <span className={timeLeft < 60 ? 'time-warning' : ''}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="question-container">
          <h3 className="question-text">{question.question}</h3>
          <div className="options-list">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`option-item ${answers[currentQuestion] === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="option-radio">
                  {answers[currentQuestion] === index && <div className="radio-dot"></div>}
                </div>
                <span className="option-text">{option}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="quiz-navigation">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn-nav"
          >
            Previous
          </button>
          <div className="question-indicators">
            {selectedQuiz.questions.map((_, index) => (
              <div
                key={index}
                className={`indicator ${index === currentQuestion ? 'active' : ''} ${answers[index] !== null ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              ></div>
            ))}
          </div>
          {currentQuestion < selectedQuiz.questions.length - 1 ? (
            <button onClick={handleNext} className="btn-nav">
              Next
            </button>
          ) : (
            <button onClick={handleSubmitQuiz} className="btn-submit-quiz">
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="quizzes-page">
      <div className="page-header">
        <h1 className="page-title">Available Quizzes</h1>
        <p className="page-subtitle">Test your knowledge and track your progress</p>
      </div>

      <div className="quizzes-container">
        {quizzes.length === 0 ? (
          <div className="no-quizzes">
            <FileText size={64} />
            <h3>No quizzes available yet</h3>
            <p>Check back later for new quizzes</p>
          </div>
        ) : (
          <div className="quizzes-grid">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="quiz-card">
                <div className="quiz-card-header">
                  <div className="quiz-subject">{quiz.subject}</div>
                  {quiz.attempted && (
                    <div className="quiz-badge">
                      <CheckCircle size={14} />
                      Completed
                    </div>
                  )}
                </div>
                <h3 className="quiz-title">{quiz.title}</h3>
                <p className="quiz-description">{quiz.description}</p>
                <div className="quiz-meta">
                  <div className="meta-item">
                    <FileText size={16} />
                    <span>{quiz.questions.length} Questions</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{quiz.duration} min</span>
                  </div>
                  <div className="meta-item">
                    <Award size={16} />
                    <span>{quiz.totalPoints} Points</span>
                  </div>
                </div>
                {quiz.lastScore && (
                  <div className="last-score">
                    Last Score: <strong>{quiz.lastScore}%</strong>
                  </div>
                )}
                <button
                  onClick={() => startQuiz(quiz)}
                  className="btn-start-quiz"
                >
                  <Play size={18} />
                  {quiz.attempted ? 'Retake Quiz' : 'Start Quiz'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesPage;
