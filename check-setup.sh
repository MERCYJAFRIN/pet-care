#!/bin/bash
# Save this as: check-setup.sh (Mac/Linux) or check-setup.bat (Windows)
# Run this to verify your Pet Care App setup

echo "=========================================="
echo "  Pet Care App - Setup Verification"
echo "=========================================="
echo ""

# Check Node.js
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js installed: $NODE_VERSION"
else
    echo "   ❌ Node.js NOT installed"
    echo "   📥 Download from: https://nodejs.org"
fi

# Check npm
echo ""
echo "2️⃣  Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "   ✅ npm installed: $NPM_VERSION"
else
    echo "   ❌ npm NOT installed"
fi

# Check backend directory
echo ""
echo "3️⃣  Checking backend folder..."
if [ -d "backend" ]; then
    echo "   ✅ backend/ folder exists"
    
    if [ -f "backend/package.json" ]; then
        echo "   ✅ backend/package.json exists"
    else
        echo "   ❌ backend/package.json NOT found"
    fi
    
    if [ -f "backend/.env" ]; then
        echo "   ✅ backend/.env exists"
        if grep -q "JWT_SECRET" backend/.env; then
            echo "   ✅ JWT_SECRET configured in .env"
        else
            echo "   ⚠️  JWT_SECRET not found in .env"
        fi
    else
        echo "   ⚠️  backend/.env NOT found (may auto-create on first run)"
    fi
else
    echo "   ❌ backend/ folder NOT found"
fi

# Check frontend directory
echo ""
echo "4️⃣  Checking frontend folder..."
if [ -d "frontend" ]; then
    echo "   ✅ frontend/ folder exists"
    
    if [ -f "frontend/package.json" ]; then
        echo "   ✅ frontend/package.json exists"
    else
        echo "   ❌ frontend/package.json NOT found"
    fi
    
    if [ -d "frontend/src" ]; then
        echo "   ✅ frontend/src/ folder exists"
    else
        echo "   ❌ frontend/src/ NOT found"
    fi
else
    echo "   ❌ frontend/ folder NOT found"
fi

# Check if node_modules exist
echo ""
echo "5️⃣  Checking dependencies..."
if [ -d "backend/node_modules" ]; then
    echo "   ✅ backend node_modules installed"
else
    echo "   ⚠️  backend node_modules NOT installed (run: cd backend && npm install)"
fi

if [ -d "frontend/node_modules" ]; then
    echo "   ✅ frontend node_modules installed"
else
    echo "   ⚠️  frontend node_modules NOT installed (run: cd frontend && npm install)"
fi

# Check ports
echo ""
echo "6️⃣  Checking if ports are available..."
if ! lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "   ✅ Port 5000 is available (for backend)"
else
    echo "   ❌ Port 5000 is already in use"
fi

if ! lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "   ✅ Port 3001 is available (for frontend)"
else
    echo "   ❌ Port 3001 is already in use"
fi

echo ""
echo "=========================================="
echo "  Verification Complete"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. cd backend && npm run dev   (in Terminal 1)"
echo "2. cd frontend && npm run dev  (in Terminal 2)"
echo "3. Open http://localhost:3001"
echo ""
