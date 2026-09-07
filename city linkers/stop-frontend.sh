#!/bin/bash

echo "🛑 Stopping Frontend Server..."

if [ -f "logs/frontend.pid" ]; then
    PID=$(cat logs/frontend.pid)
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        echo "✅ Frontend stopped (PID: $PID)"
    else
        echo "ℹ️  Frontend not running"
    fi
    rm logs/frontend.pid
else
    # Try to stop by port
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    echo "✅ Frontend stopped"
fi
