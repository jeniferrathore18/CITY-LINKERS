#!/bin/bash

echo "🚀 Starting City Linkers (Frontend Only Mode)..."
echo "=================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}ℹ️  Running in FRONTEND-ONLY mode${NC}"
echo "   Backend features will use mock data"
echo ""

# Create logs directory
mkdir -p logs

# Start frontend
echo -e "${YELLOW}🌐 Starting Frontend Server...${NC}"
python3 -m http.server 5173 > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

# Save PID
echo "$FRONTEND_PID" > logs/frontend.pid

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Frontend is ready!${NC}"
echo "=========================================="
echo ""
echo "📍 Access your app:"
echo "   http://localhost:5173"
echo ""
echo "🔑 Demo Credentials:"
echo "   User: john@example.com / password123"
echo "   Admin: admin@citylinkers.com / admin123"
echo ""
echo "ℹ️  Note: Using mock data (backend not required)"
echo ""
echo "🛑 To stop:"
echo "   kill $FRONTEND_PID"
echo "   or run: ./stop-frontend.sh"
echo ""

# Save PID for stop script
echo "$FRONTEND_PID" > logs/pids.txt

echo "✅ Open http://localhost:5173 in your browser!"
echo ""
