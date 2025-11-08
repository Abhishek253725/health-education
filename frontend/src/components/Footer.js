import React from 'react';
import { Heart, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section">
          <div className="footer-brand">
            <Heart className="footer-brand-icon" />
            <h3 className="gradient-text">EduHealth Nexus</h3>
          </div>
          <p className="footer-description">
            Empowering students through AI-powered health monitoring and 
            academic excellence. Your wellness is our priority.
          </p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <Linkedin size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/health">Health Monitor</a></li>
            <li><a href="/quizzes">Quizzes</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        {/* Features */}
        <div className="footer-section">
          <h4 className="footer-title">Features</h4>
          <ul className="footer-links">
            <li><a href="#ai-insights">AI Insights</a></li>
            <li><a href="#health-tracking">Health Tracking</a></li>
            <li><a href="#quiz-system">Smart Quizzes</a></li>
            <li><a href="#analytics">Performance Analytics</a></li>
            <li><a href="#reports">Progress Reports</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4 className="footer-title">Contact Us</h4>
          <div className="contact-info">
            <div className="contact-item">
              <Mail size={18} />
              <span>support@eduhealth.com</span>
            </div>
            <div className="contact-item">
              <Phone size={18} />
              <span>8957065945</span>
            </div>
            <div className="contact-item">
              <MapPin size={18} />
              <span>IMS ENGINEERING COLLEGE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright">
            © {currentYear} EduHealth Nexus. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="/privacy">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="/terms">Terms of Service</a>
            <span className="separator">•</span>
            <a href="/cookies">Cookie Policy</a>
          </div>
          <p className="made-with">
            Made with <Heart size={14} className="heart-icon" /> for Student Wellness
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
