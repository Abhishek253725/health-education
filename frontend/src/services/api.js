import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:5001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me')
};

// Quiz API
export const quizAPI = {
  getAll: () => api.get('/quizzes'),
  getById: (id) => api.get(`/quizzes/${id}`),
  create: (quizData) => api.post('/quizzes', quizData),
  update: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
  delete: (id) => api.delete(`/quizzes/${id}`),
  submitAttempt: (id, attemptData) => api.post(`/quizzes/${id}/attempt`, attemptData),
  getMyAttempts: () => api.get('/quizzes/attempts/my-attempts'),
  getQuizAttempts: (id) => api.get(`/quizzes/${id}/attempts`)
};

// Health API
export const healthAPI = {
  getHealthData: (studentId, days = 7) => api.get(`/health/${studentId}?days=${days}`),
  addHealthData: (healthData) => api.post('/health', healthData),
  getAnalytics: (studentId) => api.get(`/health/${studentId}/analytics`),
  simulateData: (studentId) => api.post(`/health/simulate/${studentId}`)
};

// Analytics API
export const analyticsAPI = {
  getStudentAnalytics: (studentId) => api.get(`/analytics/student/${studentId}`),
  getTeacherDashboard: () => api.get('/analytics/teacher/dashboard'),
  getParentDashboard: (childId) => api.get(`/analytics/parent/${childId}`),
  getAllStudents: () => api.get('/analytics/students/all')
};

// AI Service API
export const aiAPI = {
  analyze: async (data) => {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/analyze`, data);
      return response;
    } catch (error) {
      console.error('AI Service error:', error);
      throw error;
    }
  }
};

// Attendance API
export const attendanceAPI = {
  markAttendance: (data) => api.post('/attendance/mark', data),
  markBulkAttendance: (data) => api.post('/attendance/mark-bulk', data),
  getAttendanceByDate: (date, subject) => api.get(`/attendance/date/${date}${subject ? `?subject=${subject}` : ''}`),
  getStudentAttendance: (studentId, params) => api.get(`/attendance/student/${studentId}`, { params }),
  getStatistics: (params) => api.get('/attendance/statistics', { params }),
  deleteAttendance: (attendanceId) => api.delete(`/attendance/${attendanceId}`)
};

export default api;
