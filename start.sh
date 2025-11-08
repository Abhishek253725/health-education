#!/bin/bash

echo "========================================"
echo "  EduHealth Nexus - Starting Services"
echo "========================================"
echo ""

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eduhealth-nexus
JWT_SECRET=eduhealth_secret_key_12345
AI_SERVICE_URL=http://localhost:5001
FRONTEND_URL=http://localhost:3000
EOF
    echo "✓ Environment file created!"
fi

echo ""
echo "Starting Backend Server..."
npm run dev &
BACKEND_PID=$!

sleep 3

echo "Starting Frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

sleep 3

echo "Starting AI Service..."
cd ai-service
python app.py &
AI_PID=$!
cd ..

echo ""
echo "========================================"
echo "  All Services Started!"
echo "========================================"
echo ""
echo "  Frontend:   http://localhost:3000"
echo "  Backend:    http://localhost:5000"
echo "  AI Service: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop all services..."
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID $AI_PID 2>/dev/null; exit" INT
wait
