#!/bin/bash

# StreamlineRemote Setup Script
echo "🚀 StreamlineRemote Setup"
echo "=========================="
echo ""

# Check Python version
echo "1. Checking Python version..."
python3 --version

# Create virtual environment
echo "2. Creating Python virtual environment..."
cd backend
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "3. Installing Python dependencies..."
pip install --upgrade pip
pip install -r ../requirements.txt

# Install Playwright browsers
echo "4. Installing Playwright browsers..."
playwright install chromium

# Setup environment variables
echo "5. Setting up environment variables..."
if [ ! -f .env ]; then
    cat > .env << EOF
# Anthropic API Key (required for resume tailoring)
ANTHROPIC_API_KEY=your_api_key_here

# Application Settings
MAX_APPS_PER_WINDOW=3
WINDOW_MINUTES=20
ENABLE_STRICT_MODE=true

# Browser Settings
HEADLESS=false
USE_STEALTH=true

# Database
DB_PATH=../database/applications.xlsx
EOF
    echo "✓ Created .env file"
    echo "⚠️  Please add your ANTHROPIC_API_KEY to backend/.env"
else
    echo "✓ .env file already exists"
fi

# Create necessary directories
echo "6. Creating project directories..."
cd ..
mkdir -p database
mkdir -p logs
mkdir -p resumes/master
mkdir -p resumes/tailored

echo "✓ Directories created"

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next Steps:"
echo "==========="
echo ""
echo "1. Add your Anthropic API key to backend/.env:"
echo "   ANTHROPIC_API_KEY=sk-ant-..."
echo ""
echo "2. Update your master resume:"
echo "   nano resumes/master/master_resume.json"
echo ""
echo "3. Start the backend server:"
echo "   cd backend && source venv/bin/activate && python api_server.py"
echo ""
