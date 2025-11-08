import React, { useState } from 'react';
import { Heart, MapPin, MessageCircle, Phone, Clock, Navigation } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import './HealthPage.css';

const HealthPage = ({ user }) => {
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your health assistant. How can I help you today?' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const healthTopics = [
    { id: 1, title: 'First Aid Basics', icon: '🏥' },
    { id: 2, title: 'Stress Management', icon: '🧘' },
    { id: 3, title: 'Sleep Hygiene', icon: '😴' },
    { id: 4, title: 'Nutrition Tips', icon: '🥗' },
    { id: 5, title: 'Exercise Guide', icon: '💪' },
    { id: 6, title: 'Mental Health', icon: '🧠' }
  ];

  const healthTips = {
    1: [
      'For minor cuts: Clean with water, apply pressure, use antiseptic',
      'For burns: Cool with running water for 10-20 minutes',
      'For sprains: Rest, Ice, Compression, Elevation (RICE)',
      'Always keep a first aid kit accessible'
    ],
    2: [
      'Practice deep breathing: 4-7-8 technique',
      'Take regular breaks during study sessions',
      'Exercise for 30 minutes daily',
      'Talk to someone you trust about your feelings'
    ],
    3: [
      'Maintain consistent sleep schedule',
      'Avoid screens 1 hour before bed',
      'Keep bedroom cool and dark',
      'Aim for 7-9 hours of sleep'
    ],
    4: [
      'Eat balanced meals with fruits and vegetables',
      'Stay hydrated - drink 8 glasses of water daily',
      'Limit processed foods and sugary drinks',
      'Don\'t skip breakfast'
    ],
    5: [
      'Start with 15-20 minutes of activity daily',
      'Mix cardio and strength training',
      'Warm up before and cool down after exercise',
      'Find activities you enjoy'
    ],
    6: [
      'Practice mindfulness and meditation',
      'Maintain social connections',
      'Set realistic goals and celebrate achievements',
      'Seek professional help when needed'
    ]
  };

  const quickResponses = [
    'I have a headache',
    'Feeling stressed',
    'Sleep problems',
    'Need exercise tips'
  ];

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    setChatMessages([...chatMessages, 
      { type: 'user', text: userMessage },
      { type: 'bot', text: generateBotResponse(userMessage) }
    ]);
    setUserMessage('');
  };

  const generateBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('headache')) {
      return 'For headaches: Rest in a quiet, dark room. Stay hydrated. Apply a cold compress. If severe or persistent, consult a doctor.';
    } else if (lowerMessage.includes('stress')) {
      return 'Try deep breathing exercises, take a short walk, or practice meditation. Remember to take regular breaks from studying.';
    } else if (lowerMessage.includes('sleep')) {
      return 'Maintain a consistent sleep schedule, avoid caffeine after 2 PM, and create a relaxing bedtime routine. Aim for 7-9 hours.';
    } else if (lowerMessage.includes('exercise')) {
      return 'Start with 15-20 minutes of walking or light jogging. Gradually increase intensity. Remember to warm up and cool down!';
    } else {
      return 'I understand your concern. For specific health issues, please consult with a healthcare professional. I can provide general wellness tips!';
    }
  };

  const handleQuickResponse = (response) => {
    setUserMessage(response);
  };

  const nearbyHospitals = [
    { 
      name: 'maxwell multispeciality hospital', 
      distance: '2.3 km', 
      phone: '+1 555-0101', 
      hours: '24/7',
      position: { lat: 40.7158, lng: -74.0090 }
    },
    { 
      name: 'shivalik hospital', 
      distance: '3.1 km', 
      phone: '+1 555-0102', 
      hours: '8 AM - 8 PM',
      position: { lat: 40.7098, lng: -74.0030 }
    },
    { 
      name: 'santosh hospital', 
      distance: '8.5 km', 
      phone: '+1 555-0103', 
      hours: '24/7',
      position: { lat: 40.7188, lng: -74.0120 }
    },
    { 
      name: 'Student Health Services', 
      distance: '1.2 km', 
      phone: '+1 555-0104', 
      hours: '9 AM - 5 PM',
      position: { lat: 40.7108, lng: -74.0050 }
    }
  ];

  // User's current location (can be obtained from browser geolocation)
  const userLocation = { lat: 40.7128, lng: -74.0060 };

  // Function to open Google Maps directions
  const getDirections = (hospital) => {
    const destination = encodeURIComponent(hospital.name);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
  };

  return (
    <div className="health-page">
      <div className="page-header">
        <h1 className="page-title">Health & Wellness Center</h1>
        <p className="page-subtitle">Your complete guide to staying healthy and well</p>
      </div>

      <div className="health-container">
        {/* Health Topics */}
        <section className="health-topics-section">
          <h2 className="section-title">
            <Heart />
            Health Topics
          </h2>
          <div className="topics-grid">
            {healthTopics.map((topic) => (
              <div 
                key={topic.id} 
                className={`topic-card ${selectedTopic === topic.id ? 'active' : ''}`}
                onClick={() => {
                  console.log('Topic clicked:', topic.title);
                  setSelectedTopic(selectedTopic === topic.id ? null : topic.id);
                }}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedTopic(selectedTopic === topic.id ? null : topic.id);
                  }
                }}
              >
                <span className="topic-icon">{topic.icon}</span>
                <h3>{topic.title}</h3>
              </div>
            ))}
          </div>

          {selectedTopic && (
            <div className="topic-details">
              <h3>{healthTopics.find(t => t.id === selectedTopic)?.title}</h3>
              <ul>
                {healthTips[selectedTopic]?.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Chatbot */}
        <section className="chatbot-section">
          <h2 className="section-title">
            <MessageCircle />
            Health Assistant
          </h2>
          <div className="chat-container">
            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.type}`}>
                  <div className="message-bubble">{msg.text}</div>
                </div>
              ))}
            </div>

            <div className="quick-responses">
              {quickResponses.map((response, index) => (
                <button 
                  key={index} 
                  className="quick-response-btn"
                  onClick={() => handleQuickResponse(response)}
                >
                  {response}
                </button>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your health question..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </section>

        {/* Nearby Hospitals */}
        <section className="hospitals-section">
          <h2 className="section-title">
            <MapPin />
            Nearby Healthcare Facilities
          </h2>
          <div className="hospitals-list">
            {nearbyHospitals.map((hospital, index) => (
              <div key={index} className="hospital-card">
                <div className="hospital-info">
                  <h3>{hospital.name}</h3>
                  <div className="hospital-meta">
                    <span>
                      <MapPin size={16} />
                      {hospital.distance}
                    </span>
                    <span>
                      <Phone size={16} />
                      {hospital.phone}
                    </span>
                    <span>
                      <Clock size={16} />
                      {hospital.hours}
                    </span>
                  </div>
                </div>
                <button 
                  className="btn-directions"
                  onClick={() => getDirections(hospital)}
                  title="Open in Google Maps"
                >
                  <Navigation size={16} />
                  Get Directions
                </button>
              </div>
            ))}
          </div>

          <div className="map-section">
            <h3>Interactive Map - Find Healthcare Near You</h3>
            <MapComponent hospitals={nearbyHospitals} center={userLocation} />
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="emergency-section">
          <h2 className="section-title">Emergency Contacts</h2>
          <div className="emergency-grid">
            <div className="emergency-card">
              <div className="emergency-icon">🚑</div>
              <h3>Emergency</h3>
              <a href="tel:911" className="emergency-number">911</a>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">🏥</div>
              <h3>Campus Health</h3>
              <a href="tel:+15550104" className="emergency-number">+1 555-0104</a>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">🧠</div>
              <h3>Mental Health</h3>
              <a href="tel:988" className="emergency-number">988</a>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">☎️</div>
              <h3>Poison Control</h3>
              <a href="tel:18002221222" className="emergency-number">1-800-222-1222</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HealthPage;
