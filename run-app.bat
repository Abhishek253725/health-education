@echo off
echo ========================================
echo   EduHealth Nexus - Starting Application
echo ========================================
echo.

REM Check if setup was done
if not exist .env (
    echo ERROR: .env file not found!
    echo Please run 'setup.bat' first.
    pause
    exit /b 1
)

if not exist node_modules (
    echo ERROR: Dependencies not installed!
    echo Please run 'setup.bat' first.
    pause
    exit /b 1
)

echo Starting all services...
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
timeout /t 2 >nul

echo.
echo Starting Backend Server (Port 5000)...
start "EduHealth Backend" cmd /k "npm run dev"
timeout /t 3 >nul

echo Starting Frontend (Port 3000)...
start "EduHealth Frontend" cmd /k "cd frontend && npm start"
timeout /t 3 >nul

echo Starting AI Service (Port 5001)...
start "EduHealth AI Service" cmd /k "cd ai-service && venv\Scripts\activate && python app.py"
timeout /t 2 >nul

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo Application URLs:
echo   Frontend:   http://localhost:3000
echo   Backend:    http://localhost:5000
echo   AI Service: http://localhost:5001
echo.
echo The application will open in your browser shortly...
echo.
timeout /t 5 >nul
start http://localhost:3000
echo.
echo Press any key to stop all services...
pause >nul

echo.
echo Stopping services...
taskkill /FI "WindowTitle eq EduHealth Backend*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq EduHealth Frontend*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq EduHealth AI Service*" /T /F >nul 2>&1
echo All services stopped.
