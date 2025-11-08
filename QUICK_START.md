# 🚀 EduHealth Nexus - Quick Start Guide

Get up and running in 5 minutes!

---

## ⚡ Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js installed (`node --version`)
- ✅ Python installed (`python --version`)
- ✅ MongoDB installed or Atlas account

---

## 🎯 Quick Installation

### Step 1: Install Dependencies (2 minutes)

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install AI service dependencies
cd ai-service
pip install -r requirements.txt
cd ..
```

### Step 2: Configure Environment (1 minute)

```bash
# Copy environment template
copy .env.example .env

# Edit .env file (use default values for quick start)
notepad .env
```

**Minimal .env configuration:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eduhealth-nexus
JWT_SECRET=my_secret_key_12345
AI_SERVICE_URL=http://localhost:5001
```

### Step 3: Start Services (2 minutes)

**Option A: Automatic (Windows)**
```bash
# Double-click or run:
start-all.bat
```

**Option B: Manual**

Open 3 separate terminals:

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**Terminal 3 - AI Service:**
```bash
cd ai-service
python app.py
```

---

## 🌐 Access the Application

Once all services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:5001

---

## 👤 Test Login

Use these demo accounts:

### Student Account
```
Email: student@eduhealth.com
Password: student123
```

### Teacher Account
```
Email: teacher@eduhealth.com
Password: teacher123
```

### Parent Account
```
Email: parent@eduhealth.com
Password: parent123
```

**Note:** Create these accounts via the registration form first!

---

## 🎮 Quick Feature Tour

### 1. Register & Login (30 seconds)
1. Go to http://localhost:3000
2. Click "Login" in navbar
3. Click "Sign Up" to create account
4. Or use quick demo login buttons

### 2. Student Dashboard (2 minutes)
1. Login as student
2. View your stats and charts
3. Click "Simulate Health Data" to generate sample data
4. See AI insights appear
5. Check available quizzes

### 3. Take a Quiz (3 minutes)
1. Go to "Quizzes" page
2. Click "Start Quiz" on any quiz
3. Answer questions
4. Submit and see results
5. Return to dashboard to see updated stats

### 4. Teacher Dashboard (2 minutes)
1. Logout and login as teacher
2. Click "Create Quiz"
3. Add questions and options
4. Save quiz
5. View class analytics

### 5. Health Center (1 minute)
1. Go to "Health" page
2. Explore health topics
3. Chat with health assistant
4. View nearby facilities
5. Check emergency contacts

---

## 🔍 Verify Installation

### Check Backend
```bash
curl http://localhost:5000/api/health-check
```
Expected: `{"status":"OK"}`

### Check Frontend
Open browser: http://localhost:3000
Expected: See landing page

### Check AI Service
```bash
curl http://localhost:5001/health
```
Expected: `{"status":"OK"}`

---

## 🐛 Common Issues & Fixes

### Port Already in Use
```bash
# Windows - Kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Not Running
```bash
# Start MongoDB
mongod

# Or use MongoDB Compass
```

### Module Not Found
```bash
# Reinstall dependencies
npm install
cd frontend && npm install
cd ../ai-service && pip install -r requirements.txt
```

### Cannot Connect to Database
- Check MongoDB is running
- Verify MONGODB_URI in .env
- Try: `mongodb://127.0.0.1:27017/eduhealth-nexus`

---

## 📱 Mobile Testing

1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update frontend .env:
   ```
   REACT_APP_API_URL=http://YOUR_IP:5000/api
   ```
3. Access from phone: `http://YOUR_IP:3000`

---

## 🎯 Next Steps

1. ✅ Explore all dashboards
2. ✅ Create sample quizzes
3. ✅ Generate health data
4. ✅ Test AI insights
5. ✅ Customize colors in CSS
6. ✅ Add your own features
7. ✅ Deploy to production

---

## 📚 Additional Resources

- **Full Documentation**: See `PROJECT_DOCUMENTATION.md`
- **Installation Guide**: See `INSTALLATION.md`
- **Features List**: See `FEATURES.md`
- **README**: See `README.md`

---

## 🆘 Need Help?

**Common Questions:**

**Q: How do I create a quiz?**
A: Login as teacher → Dashboard → Create Quiz button

**Q: Where are AI insights?**
A: Student Dashboard → AI-Powered Insights section

**Q: How to simulate health data?**
A: Student Dashboard → "Simulate Health Data" button

**Q: Can't see any quizzes?**
A: Teacher must create quizzes first

**Q: How to change colors?**
A: Edit `frontend/src/index.css` → `:root` variables

---

## ✅ Success Checklist

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] MongoDB running
- [ ] Backend server running (port 5000)
- [ ] Frontend running (port 3000)
- [ ] AI service running (port 5001)
- [ ] Can access homepage
- [ ] Can register/login
- [ ] Can view dashboard
- [ ] Can take quiz
- [ ] Can see AI insights

---

## 🎉 You're All Set!

Congratulations! Your EduHealth Nexus platform is ready to use.

**Enjoy exploring the features!** 🚀

---

**Quick Links:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- AI Service: http://localhost:5001
- Documentation: PROJECT_DOCUMENTATION.md

---

*Last Updated: November 2024*
