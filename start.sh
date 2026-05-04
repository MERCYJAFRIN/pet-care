#!/bin/bash

# Pet Care App - Quick Start Script

echo "Starting Pet Care App..."
echo ""
echo "1. Starting Backend Server..."
echo "================================"

cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

echo ""
echo "2. Starting Frontend Application..."
echo "================================"

cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================"
echo "✓ Pet Care App is running!"
echo "================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait
