#!/bin/bash

echo "🚀 Starting City Linkers Web Application..."
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Add Node.js and PostgreSQL to PATH
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"

# Check if PostgreSQL is running
echo -e "${YELLOW}📊 Checking PostgreSQL...${NC}"
if pg_isready > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${RED}❌ PostgreSQL is not running${NC}"
    echo "Starting PostgreSQL..."
    brew services start postgresql@14
    sleep 3
fi

# Start backend
echo -e "${YELLOW}🔧 Starting Backend Server...${NC}"
cd backend

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${RED}Please edit backend/.env with your configuration${NC}"
    exit 1
fi

npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo -e "${YELLOW}🌐 Starting Frontend Server...${NC}"
python3 -m http.server 5173 > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 All servers started successfully!${NC}"
echo "=========================================="
echo ""
echo "📍 Service URLs:"
echo "   Frontend:   http://localhost:5173"
echo "   Backend:    http://localhost:5001"
echo "   Health:     http://localhost:5001/health"
echo ""
echo "📊 Process IDs:"
echo "   Backend:    $BACKEND_PID"
echo "   Frontend:   $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Backend:    logs/backend.log"
echo "   Frontend:   logs/frontend.log"
echo ""
echo "🛑 To stop all servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   or run: ./stop-app.sh"
echo ""
echo "✅ System ready! Open http://localhost:5173 in your browser"
echo ""

# Save PIDs to file for stop script
mkdir -p logs
echo "$BACKEND_PID" > logs/app-pids.txt
echo "$FRONTEND_PID" >> logs/app-pids.txt
