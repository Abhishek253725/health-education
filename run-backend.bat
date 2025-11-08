@echo off
echo Starting Backend Only...
cd /d %~dp0
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)
npm run dev
