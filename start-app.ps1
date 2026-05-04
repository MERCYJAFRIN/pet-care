# Pet Care Application - Quick Start Script (PowerShell)
# This script starts both backend and frontend servers

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Pet Care Application - Quick Start" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if node is installed
try {
    $nodeVersion = (node --version) 2>$null
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please download from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Preparing to start Pet Care application..." -ForegroundColor Yellow
Write-Host ""

# Navigate to backend
Set-Location backend
Write-Host "Starting Backend Server (port 5000)..." -ForegroundColor Cyan

# Start backend in new PowerShell window
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -PassThru -WindowStyle Normal
Write-Host "Backend process started (PID: $($backendJob.Id))" -ForegroundColor Green

# Wait for backend to initialize
Write-Host "Waiting 4 seconds for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

# Navigate to frontend
Set-Location ..\frontend
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan

# Start frontend in new PowerShell window
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -PassThru -WindowStyle Normal
Write-Host "Frontend process started (PID: $($frontendJob.Id))" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Waiting for servers to fully initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "📱 Opening application in your browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3003"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "API Server: http://localhost:5000" -ForegroundColor Green
Write-Host "Web App:    http://localhost:3003" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Application is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "To stop the servers, close both PowerShell windows." -ForegroundColor Yellow
Write-Host ""
Write-Host "Browser window should open automatically." -ForegroundColor Cyan
Write-Host "If not, open http://localhost:3003 manually." -ForegroundColor Cyan
Write-Host ""

# Keep this window open
Read-Host "Press Enter to exit this setup window (servers will continue running)"
