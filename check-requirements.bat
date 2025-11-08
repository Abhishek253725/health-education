@echo off
echo ========================================
echo   Checking System Requirements
echo ========================================
echo.

set "all_ok=1"

REM Check Node.js
echo [1/4] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set node_version=%%i
    echo [OK] Node.js installed: !node_version!
) else (
    echo [FAIL] Node.js not found!
    echo Please install from: https://nodejs.org/
    set "all_ok=0"
)
echo.

REM Check npm
echo [2/4] Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set npm_version=%%i
    echo [OK] npm installed: !npm_version!
) else (
    echo [FAIL] npm not found!
    set "all_ok=0"
)
echo.

REM Check Python
echo [3/4] Checking Python...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('python --version') do set python_version=%%i
    echo [OK] Python installed: !python_version!
) else (
    echo [FAIL] Python not found!
    echo Please install from: https://www.python.org/
    set "all_ok=0"
)
echo.

REM Check MongoDB
echo [4/4] Checking MongoDB...
mongod --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MongoDB installed
) else (
    echo [WARNING] MongoDB not found or not in PATH
    echo You can use MongoDB Atlas instead
    echo Or install from: https://www.mongodb.com/try/download/community
)
echo.

echo ========================================
if "%all_ok%"=="1" (
    echo   All Requirements Met!
    echo ========================================
    echo.
    echo You can now run: install-and-run.bat
) else (
    echo   Some Requirements Missing!
    echo ========================================
    echo.
    echo Please install missing software and try again.
)
echo.
pause
