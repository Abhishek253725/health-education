# 🚀 EduHealth Nexus - Installation Guide

Complete step-by-step guide to set up and run the EduHealth Nexus platform.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

---

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd major-project
```

### 2. Backend Setup

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
```bash
# Copy the example environment file
copy .env.example .env

# Edit .env file with your configuration
notepad .env
```

**Required Environment Variables:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eduhealth-nexus
JWT_SECRET=your_super_secret_jwt_key_change_this
AI_SERVICE_URL=http://localhost:5001
FRONTEND_URL=http://localhost:3000
```

#### Start MongoDB (if using local installation)
```bash
# Windows
mongod

# Or use MongoDB Compass to start the service
```

#### Run Backend Server
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

The backend server will start at `http://localhost:5000`

---

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Configure API URL (Optional)
Create `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_AI_SERVICE_URL=http://localhost:5001
```

#### Start Frontend Development Server
```bash
npm start
```

The frontend will start at `http://localhost:3000`

---

### 4. AI Service Setup

#### Navigate to AI Service Directory
```bash
cd ai-service
```

#### Create Virtual Environment (Recommended)
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Start AI Service
```bash
python app.py
```

The AI service will start at `http://localhost:5001`

---

## 🎯 Quick Start (All Services)

For convenience, you can run all services simultaneously:

### Terminal 1 - Backend
```bash
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

### Terminal 3 - AI Service
```bash
cd ai-service
python app.py
```

---

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. The application will automatically create the database and collections

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eduhealth-nexus
```

---

## 👥 Default User Accounts

For testing purposes, you can create these default accounts:

### Student Account
- Email: `student@eduhealth.com`
- Password: `student123`
- Role: Student

### Teacher Account
- Email: `teacher@eduhealth.com`
- Password: `teacher123`
- Role: Teacher

### Parent Account
- Email: `parent@eduhealth.com`
- Password: `parent123`
- Role: Parent

**Create accounts via:**
1. Use the registration form at `/login`
2. Or use API endpoint: `POST /api/auth/register`

---

## 🧪 Testing the Application

### 1. Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health-check

# Or open in browser
http://localhost:5000
```

### 2. Test AI Service
```bash
# Health check
curl http://localhost:5001/health

# Or open in browser
http://localhost:5001/health
```

### 3. Test Frontend
Open browser and navigate to:
```
http://localhost:3000
```

---

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `frontend/build` folder.

### Backend Production
```bash
# Set environment to production
# In .env file:
NODE_ENV=production

# Run with PM2 (recommended)
npm install -g pm2
pm2 start backend/server.js --name eduhealth-backend
```

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
# Create Procfile
echo "web: node backend/server.js" > Procfile

# Deploy to Render or Heroku
git push heroku main
```

### Database (MongoDB Atlas)
Already cloud-based, just update connection string.

---

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in .env file
PORT=5001
```

### MongoDB Connection Error
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify network access (for MongoDB Atlas)

### AI Service Not Working
- Check Python version: `python --version`
- Reinstall dependencies: `pip install -r requirements.txt`
- Check port 5001 is available

### Frontend Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)

---

## 🆘 Support

For issues or questions:
- Email: support@eduhealth.com
- Create an issue on GitHub
- Check the README.md for more information

---

## ✅ Verification Checklist

- [ ] Node.js and npm installed
- [ ] Python installed
- [ ] MongoDB running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] AI service dependencies installed
- [ ] Environment variables configured
- [ ] All three services running
- [ ] Can access frontend at localhost:3000
- [ ] Can login with test accounts
- [ ] Database connection successful

---

**🎉 Congratulations! Your EduHealth Nexus platform is ready to use!**
