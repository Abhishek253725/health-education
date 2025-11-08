#!/bin/bash

echo "========================================"
echo "  EduHealth Nexus - Setup Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found! Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ Python not found! Please install Python first."
    exit 1
fi

echo "[1/4] Installing backend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed!"
    exit 1
fi
echo "✓ Backend dependencies installed!"
echo ""

echo "[2/4] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed!"
    cd ..
    exit 1
fi
cd ..
echo "✓ Frontend dependencies installed!"
echo ""

echo "[3/4] Installing AI service dependencies..."
cd ai-service

# Try python3 first, then python
if command -v python3 &> /dev/null; then
    python3 -m pip install -r requirements.txt
else
    python -m pip install -r requirements.txt
fi

if [ $? -ne 0 ]; then
    echo "⚠️  Some Python packages may have failed to install."
    echo "    The app may still work. Continue anyway."
fi
cd ..
echo "✓ AI service setup complete!"
echo ""

echo "[4/4] Creating environment file..."
if [ ! -f .env ]; then
    cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eduhealth-nexus
JWT_SECRET=eduhealth_secret_key_12345
AI_SERVICE_URL=http://localhost:5001
FRONTEND_URL=http://localhost:3000
EOF
    echo "✓ Environment file created!"
else
    echo "✓ Environment file already exists!"
fi
echo ""

echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running"
echo "2. Run: ./start.sh"
echo ""
