@echo off
echo ========================================
echo   EduHealth Nexus - Complete Setup
echo ========================================
echo.
echo This will:
echo 1. Install all dependencies
echo 2. Configure environment
echo 3. Start all services
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul
echo.

REM Run setup
call setup.bat
if %errorlevel% neq 0 (
    echo Setup failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo Setup complete! Starting application in 3 seconds...
timeout /t 3 >nul

REM Run the app
call run-app.bat
