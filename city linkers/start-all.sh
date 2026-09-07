#!/bin/bash

echo "🚀 Starting City Linkers Complete System..."
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
echo -e "${YELLOW}📊 Checking PostgreSQL...${NC}"
if pg_isready > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${RED}❌ PostgreSQL is not running${NC}"
    echo "Please start PostgreSQL first:"
    echo "  macOS: brew services start postgresql@14"
    echo "  Linux: sudo systemctl start postgresql"
    exit 1
fi

# Start blockchain in background
echo -e "${YELLOW}⛓️  Starting Blockchain Node...${NC}"
cd blockchain
if [ ! -d "node_modules" ]; then
    echo "Installing blockchain dependencies..."
    npm install
fi
npm run node > ../logs/blockchain.log 2>&1 &
BLOCKCHAIN_PID=$!
echo -e "${GREEN}✅ Blockchain started (PID: $BLOCKCHAIN_PID)${NC}"
cd ..

# Wait for blockchain to start
sleep 3

# Deploy contract
echo -e "${YELLOW}📝 Deploying Smart Contract...${NC}"
cd blockchain
npm run deploy:local > ../logs/deploy.log 2>&1
cd ..
echo -e "${GREEN}✅ Contract deployed${NC}"

# Start backend
echo -e "${YELLOW}🔧 Starting Backend Server...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${RED}Please edit backend/.env with your configuration${NC}"
    exit 1
fi

# Setup database if needed
echo -e "${YELLOW}🗄️  Checking database...${NC}"
npm run db:setup > ../logs/db-setup.log 2>&1
npm run db:seed > ../logs/db-seed.log 2>&1

npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
cd ..

# Wait for backend to start
sleep 2

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
echo "   Backend:    http://localhost:5000"
echo "   Health:     http://localhost:5000/health"
echo "   Blockchain: http://127.0.0.1:8545"
echo ""
echo "📊 Process IDs:"
echo "   Blockchain: $BLOCKCHAIN_PID"
echo "   Backend:    $BACKEND_PID"
echo "   Frontend:   $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Blockchain: logs/blockchain.log"
echo "   Backend:    logs/backend.log"
echo "   Frontend:   logs/frontend.log"
echo ""
echo "🛑 To stop all servers:"
echo "   kill $BLOCKCHAIN_PID $BACKEND_PID $FRONTEND_PID"
echo "   or run: ./stop-all.sh"
echo ""
echo "✅ System ready! Open http://localhost:5173 in your browser"
echo ""

# Save PIDs to file for stop script
mkdir -p logs
echo "$BLOCKCHAIN_PID" > logs/pids.txt
echo "$BACKEND_PID" >> logs/pids.txt
echo "$FRONTEND_PID" >> logs/pids.txt
