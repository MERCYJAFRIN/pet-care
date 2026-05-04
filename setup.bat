@echo off
REM Pet Care App - Automated Setup Script for Windows

echo.
echo 🐾 Pet Care App - Setup Script
echo ==============================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✓ Node.js version: %NODE_VERSION%
echo ✓ npm version: %NPM_VERSION%
echo.

REM Setup Backend
echo 📦 Setting up Backend...
cd backend

if not exist "package.json" (
    echo ❌ backend/package.json not found
    exit /b 1
)

call npm install

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo ⚠️  Please update backend\.env with your configuration
)

if not exist "..\data" mkdir ..\data

echo ✓ Backend setup complete
echo.

REM Setup Frontend
echo 📦 Setting up Frontend...
cd ..\frontend

if not exist "package.json" (
    echo ❌ frontend/package.json not found
    exit /b 1
)

call npm install

echo ✓ Frontend setup complete
echo.

REM Final Instructions
echo ==============================
echo ✓ Setup Complete!
echo ==============================
echo.
echo 📌 Next Steps:
echo.
echo 1️⃣  Terminal 1 - Start Backend:
echo    cd backend
echo    npm run dev
echo.
echo 2️⃣  Terminal 2 - Start Frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 3️⃣  Open browser: http://localhost:3000
echo.
echo 📝 For detailed instructions, see QUICK_START.md
echo 🔗 API Documentation: See API_TESTING.md
echo 🏗️  Architecture: See ARCHITECTURE.md
echo.

pause
