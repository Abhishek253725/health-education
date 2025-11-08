# 📘 EduHealth Nexus - Complete Project Documentation

## 🎯 Project Overview

**EduHealth Nexus** is an AI-powered full-stack web application that integrates Smart Education and Smart Healthcare to help students enhance academic performance and well-being with real-time teacher and parent support.

---

## 🏗️ System Architecture

### Technology Stack

#### Frontend
- **Framework**: React.js 18
- **Routing**: React Router DOM
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Styling**: Custom CSS with CSS Variables

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator

#### AI/ML Service
- **Framework**: Flask (Python)
- **ML Library**: scikit-learn
- **Data Processing**: NumPy, Pandas
- **Model**: Linear Regression for performance prediction

---

## 📁 Project Structure

```
eduhealth-nexus/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema (Student/Teacher/Parent)
│   │   ├── Quiz.js              # Quiz schema with questions
│   │   ├── QuizAttempt.js       # Student quiz attempts
│   │   └── HealthData.js        # Health metrics (IoT simulation)
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── quizzes.js           # Quiz CRUD operations
│   │   ├── health.js            # Health data management
│   │   └── analytics.js         # Performance analytics
│   ├── middleware/
│   │   └── auth.js              # JWT verification & authorization
│   └── server.js                # Express server entry point
├── frontend/
│   ├── public/
│   │   └── index.html           # HTML template
│   └── src/
│       ├── components/
│       │   ├── Navbar.js        # Navigation bar
│       │   └── Footer.js        # Footer with links
│       ├── pages/
│       │   ├── Home.js          # Landing page
│       │   ├── Login.js         # Authentication page
│       │   ├── StudentDashboard.js
│       │   ├── TeacherDashboard.js
│       │   ├── ParentDashboard.js
│       │   ├── HealthPage.js    # Health center & chatbot
│       │   ├── QuizzesPage.js   # Quiz taking interface
│       │   └── ContactPage.js   # Contact form
│       ├── services/
│       │   └── api.js           # API service layer
│       ├── App.js               # Main app component
│       └── index.js             # React entry point
├── ai-service/
│   ├── app.py                   # Flask API server
│   ├── model.py                 # ML model implementation
│   └── requirements.txt         # Python dependencies
├── .env.example                 # Environment variables template
├── package.json                 # Node.js dependencies
└── README.md                    # Project documentation
```

---

## 🔐 Authentication System

### JWT-Based Authentication

**Registration Flow:**
1. User submits registration form
2. Password hashed with bcrypt (10 salt rounds)
3. User document created in MongoDB
4. JWT token generated and returned
5. Token stored in localStorage

**Login Flow:**
1. User submits credentials
2. Email lookup in database
3. Password comparison using bcrypt
4. JWT token generated on success
5. User data and token returned

**Protected Routes:**
- Token sent in Authorization header: `Bearer <token>`
- Middleware verifies token and extracts user ID
- Role-based access control for specific endpoints

---

## 👥 User Roles & Permissions

### Student
- View and attempt quizzes
- Track academic performance
- Monitor health metrics
- View AI-powered insights
- Access health chatbot

### Teacher
- Create, update, delete quizzes
- View class performance analytics
- Monitor student health alerts
- Export student reports
- View low-performing students

### Parent
- Monitor child's academic progress
- View health summary
- Receive notifications for concerns
- Download growth reports
- Track quiz performance

---

## 📊 Core Features Implementation

### 1. Quiz System

**Quiz Creation (Teacher):**
```javascript
POST /api/quizzes
{
  title: "Mathematics Quiz",
  subject: "Math",
  questions: [
    {
      question: "What is 2+2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1,
      points: 1
    }
  ],
  duration: 30
}
```

**Quiz Attempt (Student):**
```javascript
POST /api/quizzes/:id/attempt
{
  answers: [
    { selectedAnswer: 1 },
    { selectedAnswer: 0 }
  ],
  timeTaken: 450
}
```

**Auto-Scoring:**
- Compares selected answers with correct answers
- Calculates points earned
- Computes percentage score
- Stores attempt with timestamp

### 2. Health Monitoring

**IoT Data Simulation:**
```javascript
POST /api/health/simulate/:studentId
// Generates realistic health data:
{
  heartRate: 60-100 bpm,
  sleepHours: 5-9 hours,
  stressLevel: 0-10,
  activityLevel: "low" | "moderate" | "high",
  mood: "happy" | "neutral" | "sad" | "anxious" | "stressed"
}
```

**Health Analytics:**
- 7-day rolling average
- Abnormal value detection
- Alert generation for concerning metrics
- Visual charts with Chart.js

### 3. AI Correlation Engine

**Analysis Request:**
```python
POST /analyze
{
  sleepHours: 6.5,
  stressLevel: 7,
  heartRate: 85,
  recentScores: [75, 80, 70, 65]
}
```

**AI Response:**
```json
{
  "prediction": {
    "expectedScore": 72.5,
    "performanceCategory": "Good",
    "confidence": 85
  },
  "insights": [
    {
      "type": "warning",
      "category": "Sleep",
      "message": "Low sleep may impact performance",
      "impact": "High"
    }
  ],
  "recommendations": [
    {
      "category": "Sleep",
      "priority": "High",
      "action": "Increase sleep duration",
      "details": ["Aim for 7-9 hours", "Consistent schedule"]
    }
  ]
}
```

**ML Model:**
- Linear Regression trained on sample data
- Features: sleep_hours, stress_level, heart_rate
- Target: quiz_score (percentage)
- Predicts academic performance based on health

### 4. Real-Time Dashboard Updates

**Student Dashboard:**
- Academic performance trend chart
- Health metrics visualization
- AI-powered predictions
- Personalized recommendations
- Available quizzes list

**Teacher Dashboard:**
- Class average statistics
- Low performer alerts
- Health concern notifications
- Quiz management interface
- Student attempt tracking

**Parent Dashboard:**
- Child's performance overview
- Health summary charts
- Important notifications
- Recent quiz attempts
- Download report option

---

## 🎨 UI/UX Design

### Color Palette (Neo Mint & Violet Theme)

```css
--primary: #00C9A7      /* Neo Mint - Smart & Modern */
--secondary: #6C63FF    /* Soft Violet - AI & Creativity */
--background: #F5F7FA   /* Subtle Light Background */
--accent: #FFD166       /* Warm Yellow - Energy */
--alert: #FF6B6B        /* Coral Red - Warnings */
--text-primary: #1E293B /* Readable Dark Text */
--text-secondary: #64748B /* Muted Gray Text */
```

### Design Principles

1. **Gradient Headers**: Eye-catching gradient backgrounds
2. **Card-Based Layout**: Clean, organized content blocks
3. **Smooth Animations**: Fade-in, slide-in, hover effects
4. **Responsive Design**: Mobile-first approach
5. **Accessibility**: High contrast, readable fonts
6. **Visual Hierarchy**: Clear information structure

---

## 🔄 Data Flow

### Quiz Taking Flow
```
Student → Select Quiz → Start Timer → Answer Questions → 
Submit → Auto-Score → Store Attempt → Show Results → 
Update Analytics → Trigger AI Analysis
```

### Health Monitoring Flow
```
IoT Simulation → Generate Data → Store in DB → 
Calculate Analytics → Check Thresholds → Generate Alerts → 
Send to AI Service → Get Insights → Display to User
```

### AI Analysis Flow
```
Collect Health Data → Collect Performance Data → 
Send to AI Service → ML Model Prediction → 
Generate Insights → Create Recommendations → 
Return to Frontend → Display in Dashboard
```

---

## 🛡️ Security Features

1. **Password Security**
   - bcrypt hashing with salt rounds
   - Minimum 6 characters required
   - Never stored in plain text

2. **JWT Tokens**
   - 7-day expiration
   - Signed with secret key
   - Verified on each request

3. **Input Validation**
   - Email format validation
   - Required field checks
   - SQL injection prevention (MongoDB)

4. **CORS Protection**
   - Configured allowed origins
   - Credential support enabled

5. **Role-Based Access**
   - Middleware authorization checks
   - Route-level permissions
   - Resource ownership verification

---

## 📈 Performance Optimization

1. **Database Indexing**
   - User email (unique index)
   - Quiz attempts (student + quiz)
   - Health data (student + timestamp)

2. **Frontend Optimization**
   - Code splitting with React
   - Lazy loading components
   - Optimized images
   - CSS minification

3. **API Optimization**
   - Pagination for large datasets
   - Selective field population
   - Query optimization

4. **Caching Strategy**
   - localStorage for user data
   - API response caching
   - Static asset caching

---

## 🧪 Testing Strategy

### Backend Testing
```bash
# Use Postman or curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@eduhealth.com","password":"student123"}'
```

### Frontend Testing
- Manual testing in browser
- Cross-browser compatibility
- Responsive design testing
- User flow validation

### AI Service Testing
```python
# Test prediction endpoint
import requests
response = requests.post('http://localhost:5001/analyze', json={
    'sleepHours': 7,
    'stressLevel': 5,
    'heartRate': 75,
    'recentScores': [80, 85, 78]
})
print(response.json())
```

---

## 🚀 Deployment Guide

### Environment Setup

**Development:**
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eduhealth-nexus
```

**Production:**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/eduhealth
```

### Deployment Platforms

**Frontend**: Vercel, Netlify, GitHub Pages
**Backend**: Render, Heroku, Railway, AWS
**Database**: MongoDB Atlas
**AI Service**: Render, Heroku, PythonAnywhere

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "student" | "teacher" | "parent",
  studentId: String (for students),
  parentOf: ObjectId (for parents),
  class: String,
  createdAt: Date
}
```

### Quizzes Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  subject: String,
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    points: Number
  }],
  createdBy: ObjectId (ref: User),
  duration: Number,
  totalPoints: Number,
  isActive: Boolean,
  createdAt: Date
}
```

### QuizAttempts Collection
```javascript
{
  _id: ObjectId,
  quiz: ObjectId (ref: Quiz),
  student: ObjectId (ref: User),
  answers: [{
    questionId: ObjectId,
    selectedAnswer: Number,
    isCorrect: Boolean,
    pointsEarned: Number
  }],
  score: Number,
  percentage: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  timeTaken: Number,
  attemptedAt: Date
}
```

### HealthData Collection
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: User),
  heartRate: Number (40-200),
  sleepHours: Number (0-24),
  stressLevel: Number (0-10),
  activityLevel: String,
  mood: String,
  notes: String,
  timestamp: Date
}
```

---

## 🎓 Educational Value

This project demonstrates:

1. **Full-Stack Development**: Complete MERN stack implementation
2. **AI Integration**: Machine learning for predictive analytics
3. **Real-Time Systems**: IoT data simulation and processing
4. **Role-Based Systems**: Multi-user type architecture
5. **RESTful API Design**: Clean, scalable API structure
6. **Modern UI/UX**: Contemporary design patterns
7. **Data Visualization**: Interactive charts and graphs
8. **Security Best Practices**: Authentication and authorization

---

## 🔮 Future Enhancements

1. **Dark Mode**: Theme toggle functionality
2. **Voice Assistant**: Voice-based navigation
3. **Gamification**: Badges and achievements
4. **Notifications**: Email/SMS alerts via Twilio
5. **Video Calls**: WebRTC tele-consultation
6. **Mobile App**: React Native version
7. **Advanced Analytics**: More ML models
8. **Social Features**: Student collaboration tools

---

## 📞 Support & Contribution

**For Issues:**
- Create GitHub issue
- Email: support@eduhealth.com

**For Contributions:**
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

---

## 📄 License

MIT License - Free for educational and commercial use

---

## 🙏 Acknowledgments

- Chart.js for visualization
- Lucide React for icons
- MongoDB for database
- React team for framework
- scikit-learn for ML capabilities

---

**Built with ❤️ for Student Wellness**

*Version 1.0.0 - November 2024*
