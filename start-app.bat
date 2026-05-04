@echo off
REM Pet Care Application - Quick Start Script
REM This script starts both backend and frontend servers

echo.
echo ============================================
echo  Pet Care Application - Quick Start
echo ============================================
echo.

REM Check if node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download from https://nodejs.org/
    pause
    exit /b 1
)

echo Preparing to start Pet Care application...
echo.

REM Start backend in a new window
cd backend
echo Starting Backend Server (port 5000)...
start "Pet Care - Backend" cmd /k npm start

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start frontend in a new window
cd ..\frontend
echo Starting Frontend Server (port 3003)...
start "Pet Care - Frontend" cmd /k npm run dev

echo.
echo ✅ Both servers are starting!
echo.
echo Waiting for servers to initialize...
timeout /t 5 /nobreak
echo.
echo 📱 Opening application in browser...
start http://localhost:3003
echo.
echo Application should open in your default browser.
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3003
echo.
echo To stop: Close the terminal windows
echo.
pause
