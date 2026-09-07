#!/bin/bash

echo "🛑 Stopping City Linkers System..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Read PIDs from file
if [ -f "logs/pids.txt" ]; then
    while IFS= read -r pid; do
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${RED}Stopping process $pid...${NC}"
            kill $pid
        fi
    done < logs/pids.txt
    rm logs/pids.txt
    echo -e "${GREEN}✅ All servers stopped${NC}"
else
    echo "No PID file found. Stopping by port..."
    
    # Stop by port
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    lsof -ti:5000 | xargs kill -9 2>/dev/null
    lsof -ti:8545 | xargs kill -9 2>/dev/null
    
    echo -e "${GREEN}✅ Servers stopped${NC}"
fi
