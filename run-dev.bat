@echo off
echo Starting EduHealth Nexus Development Environment...
echo.

REM Check if node_modules exists in root
if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
)

REM Check if node_modules exists in frontend
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo Starting all services...
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop all services
echo.

start cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 3 /nobreak >nul
start cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo All services are starting in separate windows...
echo You can close this window.
pause
