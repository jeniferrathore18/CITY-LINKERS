#!/bin/bash

echo "🛑 Stopping City Linkers Web Application..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Read PIDs from file
if [ -f "logs/app-pids.txt" ]; then
    while read pid; do
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${RED}Stopping process $pid...${NC}"
            kill $pid
        fi
    done < logs/app-pids.txt
    rm logs/app-pids.txt
    echo -e "${GREEN}✅ All servers stopped${NC}"
else
    echo "No PID file found. Trying to stop by port..."
    
    # Stop backend (port 5000)
    BACKEND_PID=$(lsof -ti:5000)
    if [ ! -z "$BACKEND_PID" ]; then
        echo -e "${RED}Stopping backend (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID
    fi
    
    # Stop frontend (port 5173)
    FRONTEND_PID=$(lsof -ti:5173)
    if [ ! -z "$FRONTEND_PID" ]; then
        echo -e "${RED}Stopping frontend (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID
    fi
    
    echo -e "${GREEN}✅ Servers stopped${NC}"
fi
