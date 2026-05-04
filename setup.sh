#!/bin/bash

# Pet Care App - Automated Setup Script

echo "🐾 Pet Care App - Setup Script"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ backend/package.json not found"
    exit 1
fi

# Install dependencies
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your configuration"
fi

# Create data directory
mkdir -p ../data

echo "✓ Backend setup complete"
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd ../frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ frontend/package.json not found"
    exit 1
fi

# Install dependencies
npm install

echo "✓ Frontend setup complete"
echo ""

# Final Instructions
echo "=============================="
echo "✓ Setup Complete!"
echo "=============================="
echo ""
echo "📌 Next Steps:"
echo ""
echo "1️⃣  Terminal 1 - Start Backend:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2️⃣  Terminal 2 - Start Frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3️⃣  Open browser: http://localhost:3000"
echo ""
echo "📝 For detailed instructions, see QUICK_START.md"
echo "🔗 API Documentation: See API_TESTING.md"
echo "🏗️  Architecture: See ARCHITECTURE.md"
echo ""
