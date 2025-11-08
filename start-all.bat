@echo off
echo ========================================
echo   EduHealth Nexus - Starting All Services
echo ========================================
echo.

echo Starting MongoDB...
start "MongoDB" cmd /k "mongod"
timeout /t 3

echo Starting Backend Server...
start "Backend" cmd /k "npm run dev"
timeout /t 3

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm start"
timeout /t 3

echo Starting AI Service...
start "AI Service" cmd /k "cd ai-service && python app.py"

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo AI Service: http://localhost:5001
echo.
echo Press any key to exit...
pause >nul
