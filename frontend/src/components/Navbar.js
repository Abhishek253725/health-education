import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Heart, BookOpen, FileText, Mail, LogOut, Menu, X, User 
} from 'lucide-react';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo">
            <Heart className="brand-icon" />
            <span className="brand-text gradient-text">EduHealth Nexus</span>
          </div>
        </Link>

        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

          {user && (
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen size={18} />
              <span>Dashboard</span>
            </Link>
          )}

          <Link 
            to="/health" 
            className={`nav-link ${isActive('/health') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Heart size={18} />
            <span>Health</span>
          </Link>

          <Link 
            to="/quizzes" 
            className={`nav-link ${isActive('/quizzes') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <FileText size={18} />
            <span>Quizzes</span>
          </Link>

          <Link 
            to="/contact" 
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Mail size={18} />
            <span>Contact</span>
          </Link>

          <div className="navbar-actions">
            {user ? (
              <>
                <div className="user-info">
                  <User size={18} />
                  <span>{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-login">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
