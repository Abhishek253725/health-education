@echo off
title EduHealth Nexus - One Click Start
color 0A

echo.
echo  ========================================
echo    EDUHEALTH NEXUS - STARTING...
echo  ========================================
echo.

REM Create .env if it doesn't exist
if not exist .env (
    echo Creating environment file...
    (
        echo PORT=5000
        echo NODE_ENV=development
        echo MONGODB_URI=mongodb://localhost:27017/eduhealth-nexus
        echo JWT_SECRET=eduhealth_secret_key_12345
        echo AI_SERVICE_URL=http://localhost:5001
        echo FRONTEND_URL=http://localhost:3000
    ) > .env
    echo Environment configured!
)

echo.
echo Starting Backend Server...
start "Backend" cmd /k "color 0B && title Backend Server && npm run dev"
timeout /t 3 >nul

echo Starting Frontend...
start "Frontend" cmd /k "color 0E && title Frontend && cd frontend && npm start"
timeout /t 3 >nul

echo Starting AI Service...
start "AI Service" cmd /k "color 0D && title AI Service && cd ai-service && python app.py"

echo.
echo  ========================================
echo    ALL SERVICES STARTED!
echo  ========================================
echo.
echo  Frontend:   http://localhost:3000
echo  Backend:    http://localhost:5000
echo  AI Service: http://localhost:5001
echo.
echo  Opening browser in 5 seconds...
echo  ========================================
echo.

timeout /t 5 >nul
start http://localhost:3000

echo.
echo Application is running!
echo Close this window to keep services running.
echo.
pause
