@echo off
echo ========================================
echo   EduHealth Nexus - Automatic Setup
echo ========================================
echo.

echo [1/5] Setting up environment variables...
if not exist .env (
    copy .env.example .env
    echo Environment file created!
) else (
    echo Environment file already exists.
)
echo.

echo [2/5] Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed!
echo.

echo [3/5] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    cd ..
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies installed!
echo.

echo [4/5] Setting up AI service...
cd ai-service
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo WARNING: Some Python packages may have failed to install.
    echo This is often okay - the app may still work.
)
call deactivate
cd ..
echo AI service setup complete!
echo.

echo [5/5] Creating default .env if needed...
if not exist .env (
    (
        echo PORT=5000
        echo NODE_ENV=development
        echo MONGODB_URI=mongodb://localhost:27017/eduhealth-nexus
        echo JWT_SECRET=eduhealth_secret_key_12345_change_in_production
        echo AI_SERVICE_URL=http://localhost:5001
        echo FRONTEND_URL=http://localhost:3000
    ) > .env
    echo Default .env created!
)
echo.

echo ========================================
echo   Setup Complete! 
echo ========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run 'run-app.bat' to start all services
echo.
echo Press any key to exit...
pause >nul
