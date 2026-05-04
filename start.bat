@echo off
REM Pet Care App - Quick Start Script for Windows

echo Starting Pet Care App...
echo.
echo 1. Starting Backend Server...
echo ================================

cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

start cmd /k "npm run dev"

REM Wait for backend to start
timeout /t 3 /nobreak

echo.
echo 2. Starting Frontend Application...
echo ================================

cd ../frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

start cmd /k "npm run dev"

echo.
echo ================================
echo ✓ Pet Care App is running!
echo ================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Close the terminal windows to stop the servers.
echo.

pause
