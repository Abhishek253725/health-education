# 🚀 How to Run EduHealth Nexus

## ⚡ FASTEST WAY (One Click)

### Just double-click: `CLICK_TO_START.bat`

That's it! The application will:
1. ✅ Configure environment automatically
2. ✅ Start all 3 services (Backend, Frontend, AI)
3. ✅ Open in your browser at http://localhost:3000

---

## 📋 What You Need First

Make sure you have installed:
- ✅ **Node.js** - [Download here](https://nodejs.org/)
- ✅ **Python** - [Download here](https://www.python.org/)
- ⚠️ **MongoDB** (Optional - can use cloud version)

**Check if installed:** Run `check-requirements.bat`

---

## 🔧 First Time Setup

If this is your first time, run these commands once:

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

**OR** just run: `setup.bat` (does everything automatically)

---

## 🎮 Running the Application

### Option 1: One-Click Start (Recommended)
```
Double-click: CLICK_TO_START.bat
```

### Option 2: Complete Setup + Run
```
Double-click: install-and-run.bat
```

### Option 3: Manual Start
Open 3 terminals:

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

Once running, open your browser:

- **Main App**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:5001

---

## 👤 Test Accounts

Register these accounts to test all features:

### Student
- Email: `student@eduhealth.com`
- Password: `student123`

### Teacher
- Email: `teacher@eduhealth.com`
- Password: `teacher123`

### Parent
- Email: `parent@eduhealth.com`
- Password: `parent123`

---

## 🐛 Troubleshooting

### "Port already in use"
Close other apps using ports 3000, 5000, or 5001

### "MongoDB connection failed"
- Option 1: Start MongoDB service
- Option 2: Use MongoDB Atlas (cloud) - Update `.env` file

### "Module not found"
Run: `npm install` and `cd frontend && npm install`

### Python errors
Make sure Python is installed and in PATH

---

## 🛑 Stopping the Application

- Close all terminal windows
- Or press `Ctrl+C` in each terminal

---

## 📚 More Help

- See `START_HERE.txt` for detailed guide
- See `QUICK_START.md` for quick reference
- See `README.md` for full documentation

---

## ✅ Quick Checklist

- [ ] Node.js installed
- [ ] Python installed
- [ ] Dependencies installed (`npm install`)
- [ ] Double-clicked `CLICK_TO_START.bat`
- [ ] Browser opened at localhost:3000
- [ ] Can see the homepage
- [ ] Can register/login

---

**🎉 That's it! Enjoy using EduHealth Nexus!**
