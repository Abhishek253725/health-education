import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import HealthPage from './pages/HealthPage';
import QuizzesPage from './pages/QuizzesPage';
import ContactPage from './pages/ContactPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const getDashboard = () => {
    if (!user) return <Navigate to="/login" />;
    
    switch (user.role) {
      case 'student':
        return <StudentDashboard user={user} />;
      case 'teacher':
        return <TeacherDashboard user={user} />;
      case 'parent':
        return <ParentDashboard user={user} />;
      default:
        return <Navigate to="/" />;
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading EduHealth Nexus...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
            />
            <Route path="/dashboard" element={getDashboard()} />
            <Route path="/health" element={<HealthPage user={user} />} />
            <Route path="/quizzes" element={<QuizzesPage user={user} />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
