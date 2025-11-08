# 🎓 EduHealth Nexus

**Smart Health & Mind Care System for Students**

An AI-powered platform integrating Smart Education and Smart Healthcare to help students enhance academic performance and well-being — with real-time teacher and parent support.

---

## 🌟 Features

### 👨‍🎓 Student Dashboard
- Auto-synced quiz list with attempt status
- Instant score calculation and feedback
- Academic progress tracking with charts
- Health monitoring (sleep, stress, heart rate)
- AI-powered personalized tips
- Overall performance + health reports

### 🎓 Teacher Dashboard
- Create, update, and delete quizzes
- Real-time student submission tracking
- Class performance analytics
- Alerts for low-performing or unhealthy students
- Export student reports (PDF)

### 👨‍👩‍👧 Parent Dashboard
- Monitor child's academic performance
- View weekly health summary charts
- Smart notifications for irregular patterns
- Download comprehensive growth reports

### 🧠 AI-Powered Insights
- Correlates health data with academic performance
- Predicts performance drops due to health issues
- Generates personalized improvement suggestions

### ❤️ Health Monitoring
- Simulated IoT data (sleep, heart rate, stress)
- Visual analytics with charts
- Preventive health suggestions
- Health desk chatbot
- Nearby hospitals/clinics map

---

## 🧰 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React.js, Chart.js, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **AI Module** | Python, Flask, scikit-learn |
| **Authentication** | JWT, bcrypt |
| **APIs** | Google Maps API |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or Atlas)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd major-project
```

### 2. Backend Setup
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB (if local)
mongod

# Run backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. AI Service Setup
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

---

## 📁 Project Structure

```
eduhealth-nexus/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Dashboard pages
│       ├── services/    # API calls
│       ├── utils/       # Helper functions
│       └── App.js
├── ai-service/
│   ├── app.py           # Flask API
│   ├── model.py         # ML model
│   └── requirements.txt
└── README.md
```

---

## 🎨 Color Palette

**Neo Mint & Violet Theme** (AI-Tech inspired)

- **Primary**: `#00C9A7` (Neo Mint) - Smart & modern
- **Secondary**: `#6C63FF` (Soft Violet) - AI & creativity
- **Background**: `#F5F7FA` - Subtle light
- **Accent**: `#FFD166` (Warm Yellow) - Energy
- **Alert**: `#FF6B6B` (Coral Red) - Warnings
- **Text**: `#1E293B` - Readable

---

## 🔐 Default Login Credentials

### Teacher
- Email: `teacher@eduhealth.com`
- Password: `teacher123`

### Student
- Email: `student@eduhealth.com`
- Password: `student123`

### Parent
- Email: `parent@eduhealth.com`
- Password: `parent123`

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `POST /api/quizzes` - Create quiz (Teacher)
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz

### Health
- `GET /api/health/:studentId` - Get health data
- `POST /api/health` - Add health data
- `GET /api/health/:studentId/analytics` - Get analytics

### AI Insights
- `POST /api/ai/analyze` - Get AI predictions

---

## 🎯 Key Features Implementation

### 1. Role-Based Authentication
- JWT tokens for secure sessions
- Password hashing with bcrypt
- Role-specific route protection

### 2. Real-Time Updates
- Automatic quiz synchronization
- Live performance tracking
- Instant feedback system

### 3. Health Monitoring
- Simulated IoT data generation
- Time-series data storage
- Visual analytics with Chart.js

### 4. AI Correlation Engine
- Linear regression model
- Health-performance correlation
- Personalized recommendations

### 5. Report Generation
- PDF export functionality
- Combined academic + health reports
- Visual charts and graphs

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel deploy
```

### Backend (Render/Heroku)
```bash
# Add Procfile
echo "web: node backend/server.js" > Procfile
git push heroku main
```

### Database (MongoDB Atlas)
- Create cluster at mongodb.com
- Update MONGODB_URI in .env

---

## 📝 Future Enhancements

- [ ] Dark mode toggle
- [ ] Voice assistant navigation
- [ ] Gamified achievement badges
- [ ] WhatsApp/Email alerts via Twilio
- [ ] WebRTC tele-consultation
- [ ] Mobile app (React Native)

---

## 👥 Contributors

- Your Name - Developer

---

## 📄 License

MIT License - feel free to use for educational purposes

---

## 📧 Contact

For queries or support, contact: your-email@example.com

---

**Made with ❤️ for Student Wellness**
