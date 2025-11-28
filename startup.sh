#!/bin/bash

# Aggressive port killer and startup script
# This script kills any process using the specified port and starts the Node.js server

PORT=${PORT:-8000}

echo "🚀 Starting Isaac's Learning Hub..."
echo "📌 Using port: $PORT"

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    echo "🔪 Killing processes on port $port..."
    
    # Find and kill processes using the port (works on macOS and Linux)
    if command -v lsof > /dev/null; then
        # macOS/Linux using lsof
        local pids=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pids" ]; then
            echo "   Found processes: $pids"
            kill -9 $pids 2>/dev/null
            sleep 1
            echo "   ✅ Port $port cleared"
        else
            echo "   ✅ Port $port is already free"
        fi
    elif command -v netstat > /dev/null; then
        # Alternative using netstat (Linux)
        local pids=$(netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1 | sort -u)
        if [ ! -z "$pids" ]; then
            echo "   Found processes: $pids"
            kill -9 $pids 2>/dev/null
            sleep 1
            echo "   ✅ Port $port cleared"
        else
            echo "   ✅ Port $port is already free"
        fi
    else
        echo "   ⚠️  Could not find lsof or netstat - skipping port cleanup"
    fi
}

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "   Creating .env.example template..."
    cat > .env.example << 'EOF'
# API Keys and Secrets
# Copy this file to .env and add your actual API keys
# DO NOT COMMIT .env TO GIT
OPENROUTER_API_KEY=your-api-key-here
EOF
    echo "   Please create .env file with your API keys"
    echo "   You can copy .env.example to .env and update it"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Kill any process on the target port
kill_port $PORT

# Export PORT for the Node.js process
export PORT=$PORT

# Start the server
echo "🎮 Starting Node.js server on port $PORT..."
echo "   Open http://localhost:$PORT in your browser"
echo "   Press Ctrl+C to stop the server"
echo ""

node server.js

