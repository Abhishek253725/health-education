import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, Heart, TrendingUp, Users, Award, Shield, 
  Activity, BookOpen, Sparkles 
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: <Brain />,
      title: 'AI-Powered Insights',
      description: 'Get personalized recommendations based on health and academic data correlation'
    },
    {
      icon: <Heart />,
      title: 'Health Monitoring',
      description: 'Track sleep, stress, and vital signs with IoT-simulated real-time data'
    },
    {
      icon: <TrendingUp />,
      title: 'Performance Analytics',
      description: 'Visualize academic progress with interactive charts and detailed reports'
    },
    {
      icon: <Users />,
      title: 'Multi-Role Support',
      description: 'Dedicated dashboards for students, teachers, and parents'
    },
    {
      icon: <Award />,
      title: 'Smart Quizzes',
      description: 'Auto-synced quizzes with instant feedback and score calculation'
    },
    {
      icon: <Shield />,
      title: 'Secure & Private',
      description: 'JWT authentication and encrypted data storage for your safety'
    }
  ];

  const stats = [
    { value: '500+', label: 'Active Students' },
    { value: '50+', label: 'Teachers' },
    { value: '95%', label: 'Success Rate' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>AI-Powered Platform</span>
          </div>
          <h1 className="hero-title">
            <span className="gradient-text glow-effect">EduHealth Nexus</span>
            <br />
            Smart Health & Mind Care for Students
          </h1>
          <p className="hero-description">
            Revolutionizing student wellness through AI-driven health monitoring 
            and academic performance tracking. Empowering students, teachers, 
            and parents with real-time insights.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn-primary">
              Get Started
              <Activity size={18} />
            </Link>
            <Link to="/health" className="btn-secondary">
              Learn More
              <BookOpen size={18} />
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <Heart className="card-icon" />
            <div className="card-content">
              <span className="card-label">Heart Rate</span>
              <span className="card-value">72 bpm</span>
            </div>
          </div>
          <div className="floating-card card-2">
            <Brain className="card-icon" />
            <div className="card-content">
              <span className="card-label">AI Score</span>
              <span className="card-value">85%</span>
            </div>
          </div>
          <div className="floating-card card-3">
            <TrendingUp className="card-icon" />
            <div className="card-content">
              <span className="card-label">Performance</span>
              <span className="card-value">+15%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3 className="stat-value gradient-text">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">
            Everything you need to excel academically while maintaining optimal health
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card card-hover">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Simple steps to start your wellness journey
          </p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3 className="step-title">Sign Up</h3>
            <p className="step-description">
              Create your account as a student, teacher, or parent
            </p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <h3 className="step-title">Track Health</h3>
            <p className="step-description">
              Monitor your health metrics with our IoT simulation
            </p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <h3 className="step-title">Take Quizzes</h3>
            <p className="step-description">
              Attempt quizzes and track your academic progress
            </p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">4</div>
            <h3 className="step-title">Get AI Insights</h3>
            <p className="step-description">
              Receive personalized recommendations for improvement
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Learning?</h2>
          <p className="cta-description">
            Join thousands of students already improving their health and academics
          </p>
          <Link to="/login" className="btn-cta">
            Start Your Journey
            <Sparkles size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
