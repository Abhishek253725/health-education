# 🚀 Running EduHealth Nexus in Git Bash

## 📋 Prerequisites

Make sure you have installed:
- ✅ Node.js
- ✅ Python
- ✅ MongoDB (or use MongoDB Atlas)

---

## ⚡ Quick Start (Automated)

### Option 1: One-Command Setup + Run

```bash
# Navigate to project
cd /d/major\ project

# Make scripts executable
chmod +x setup.sh start.sh

# Run setup (first time only)
./setup.sh

# Start the application
./start.sh
```

---

## 🔧 Manual Setup (Step by Step)

### Step 1: Navigate to Project

```bash
cd /d/major\ project
```

### Step 2: Install Dependencies

```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..

# AI Service
cd ai-service
pip install -r requirements.txt
cd ..
```

### Step 3: Create Environment File

```bash
# Copy template
cp .env.example .env

# Or create manually
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eduhealth-nexus
JWT_SECRET=eduhealth_secret_key_12345
AI_SERVICE_URL=http://localhost:5001
FRONTEND_URL=http://localhost:3000
EOF
```

---

## 🎮 Running the Application

### Method 1: Using Start Script (Recommended)

```bash
# Make script executable
chmod +x start.sh

# Run the script
./start.sh
```

This starts all services in the background.

---

### Method 2: Manual Start (3 Terminals)

Open **3 separate Git Bash terminals**:

#### Terminal 1 - Backend
```bash
cd /d/major\ project
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd /d/major\ project/frontend
npm start
```

#### Terminal 3 - AI Service
```bash
cd /d/major\ project/ai-service
python app.py
```

---

### Method 3: Using tmux (Advanced)

If you have tmux installed:

```bash
# Start tmux session
tmux new -s eduhealth

# Split into 3 panes
# Ctrl+B then " (split horizontal)
# Ctrl+B then % (split vertical)

# In each pane, run:
# Pane 1: npm run dev
# Pane 2: cd frontend && npm start
# Pane 3: cd ai-service && python app.py

# Detach: Ctrl+B then D
# Reattach: tmux attach -t eduhealth
```

---

## 🌐 Access the Application

Once all services are running:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **AI Service**: http://localhost:5001

---

## 🛑 Stopping the Application

### If using start.sh:
```bash
# Press Ctrl+C in the terminal
```

### If using manual terminals:
```bash
# Press Ctrl+C in each terminal
```

### Kill all Node processes:
```bash
# Windows (Git Bash)
taskkill //F //IM node.exe
taskkill //F //IM python.exe
```

---

## 🐛 Troubleshooting

### "Permission denied" when running scripts
```bash
chmod +x setup.sh start.sh
```

### "npm: command not found"
```bash
# Add Node.js to PATH or restart Git Bash
export PATH=$PATH:/c/Program\ Files/nodejs
```

### "python: command not found"
```bash
# Try python3 instead
python3 --version

# Or add Python to PATH
export PATH=$PATH:/c/Users/YOUR_USERNAME/AppData/Local/Programs/Python/Python311
```

### Port already in use
```bash
# Find and kill process
netstat -ano | grep :3000
taskkill //PID <PID> //F
```

### MongoDB connection error
```bash
# Start MongoDB
net start MongoDB

# Or use MongoDB Atlas and update .env:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/eduhealth
```

---

## 📝 Useful Git Bash Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Python version
python --version

# List running processes
ps aux | grep node

# Check if ports are in use
netstat -ano | grep :3000
netstat -ano | grep :5000
netstat -ano | grep :5001

# View logs
npm run dev 2>&1 | tee backend.log
```

---

## 🎯 Complete Workflow

```bash
# 1. Clone/Navigate to project
cd /d/major\ project

# 2. First time setup
chmod +x setup.sh
./setup.sh

# 3. Start application
chmod +x start.sh
./start.sh

# 4. Open browser
start http://localhost:3000

# 5. Stop application
# Press Ctrl+C
```

---

## 💡 Pro Tips

1. **Use Tab Completion**: Type `cd /d/maj` then press Tab
2. **Command History**: Use Up/Down arrows
3. **Clear Screen**: Type `clear` or press Ctrl+L
4. **Copy/Paste**: Right-click in Git Bash
5. **Multiple Tabs**: Use Windows Terminal with Git Bash

---

## 🔄 Development Workflow

```bash
# Watch for changes (auto-reload)
npm run dev          # Backend auto-reloads
npm start            # Frontend auto-reloads

# View real-time logs
tail -f backend.log
```

---

## ✅ Quick Checklist

- [ ] Git Bash installed
- [ ] Node.js installed
- [ ] Python installed
- [ ] MongoDB running
- [ ] Dependencies installed (`./setup.sh`)
- [ ] Environment configured (`.env` exists)
- [ ] All services started (`./start.sh`)
- [ ] Browser opened at localhost:3000

---

**🎉 You're all set! The application should now be running in Git Bash!**

For more help, see:
- `README.md`
- `QUICK_START.md`
- `INSTALLATION.md`
