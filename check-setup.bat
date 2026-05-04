@echo off
REM Pet Care App - Setup Verification for Windows
REM Save this as: check-setup.bat
REM Run by double-clicking or: check-setup.bat

echo.
echo ==========================================
echo   Pet Care App - Setup Verification
echo ==========================================
echo.

REM Check Node.js
echo 1. Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
    echo    [OK] Node.js installed: %NODE_VER%
) else (
    echo    [FAILED] Node.js NOT installed
    echo    Download from: https://nodejs.org
)

REM Check npm
echo.
echo 2. Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i
    echo    [OK] npm installed: %NPM_VER%
) else (
    echo    [FAILED] npm NOT installed
)

REM Check backend directory
echo.
echo 3. Checking backend folder...
if exist "backend" (
    echo    [OK] backend folder exists
    
    if exist "backend\package.json" (
        echo    [OK] backend\package.json exists
    ) else (
        echo    [FAILED] backend\package.json NOT found
    )
    
    if exist "backend\.env" (
        echo    [OK] backend\.env exists
        findstr /M "JWT_SECRET" backend\.env >nul
        if %ERRORLEVEL% EQU 0 (
            echo    [OK] JWT_SECRET configured
        ) else (
            echo    [WARNING] JWT_SECRET not found in .env
        )
    ) else (
        echo    [WARNING] backend\.env NOT found
    )
) else (
    echo    [FAILED] backend folder NOT found
)

REM Check frontend directory
echo.
echo 4. Checking frontend folder...
if exist "frontend" (
    echo    [OK] frontend folder exists
    
    if exist "frontend\package.json" (
        echo    [OK] frontend\package.json exists
    ) else (
        echo    [FAILED] frontend\package.json NOT found
    )
    
    if exist "frontend\src" (
        echo    [OK] frontend\src folder exists
    ) else (
        echo    [FAILED] frontend\src NOT found
    )
) else (
    echo    [FAILED] frontend folder NOT found
)

REM Check node_modules
echo.
echo 5. Checking dependencies...
if exist "backend\node_modules" (
    echo    [OK] backend node_modules installed
) else (
    echo    [WARNING] backend node_modules NOT found - run: cd backend ^&^& npm install
)

if exist "frontend\node_modules" (
    echo    [OK] frontend node_modules installed
) else (
    echo    [WARNING] frontend node_modules NOT found - run: cd frontend ^&^& npm install
)

REM Check ports
echo.
echo 6. Checking if ports are available...
netstat -ano | findstr :5000 >nul
if %ERRORLEVEL% NEQ 0 (
    echo    [OK] Port 5000 is available ^(backend^)
) else (
    echo    [WARNING] Port 5000 may be in use
)

netstat -ano | findstr :3001 >nul
if %ERRORLEVEL% NEQ 0 (
    echo    [OK] Port 3001 is available ^(frontend^)
) else (
    echo    [WARNING] Port 3001 may be in use
)

echo.
echo ==========================================
echo   Verification Complete
echo ==========================================
echo.
echo Next steps:
echo 1. Open PowerShell or Command Prompt
echo 2. Run: cd backend
echo    Then: npm run dev
echo 3. Open new terminal window
echo 4. Run: cd frontend
echo    Then: npm run dev
echo 5. Open browser: http://localhost:3001
echo.
pause
