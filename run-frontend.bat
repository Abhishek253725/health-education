@echo off
echo Starting Frontend Only...
cd /d %~dp0frontend
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)
npm start
