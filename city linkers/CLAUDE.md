# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

City Linkers is a smart transit system with real-time GPS bus tracking, blockchain-backed e-ticketing (NFT tickets), and PostgreSQL database. It uses a separate frontend/backend architecture with Hardhat for local blockchain development.

## Quick Start Commands

```bash
# Start all services (PostgreSQL, Blockchain, Backend, Frontend)
./start-all.sh

# Stop all services
./stop-all.sh
```

Then open http://localhost:5173

## Architecture

```
Frontend (Port 5173) ←→ Backend API (Port 5000) ←→ PostgreSQL (Port 5432)
                                ↓
                         Blockchain (Port 8545)
```

## Development Commands

### Backend (Node.js/Express)
```bash
cd backend
npm install              # Install dependencies
npm run dev              # Start with nodemon (auto-reload)
npm run db:setup         # Initialize database tables
npm run db:seed          # Seed demo data
npm start                # Production start
```

### Blockchain (Hardhat)
```bash
cd ../blockchain         # Note: blockchain folder is at Desktop/blockchain (sibling to city linkers)
npm install
npm run node             # Start local Hardhat node (keep running)
npm run compile          # Compile smart contracts
npm run deploy:local     # Deploy to local node
npm run test             # Run contract tests
```

### Frontend
```bash
python3 -m http.server 5173   # Start frontend server
```

## Key Architecture Details

### Frontend (Vanilla JS)
- Entry point: `js/app.js` - Main application initialization
- Router: `js/router.js` - Client-side routing (hash-based)
- Pages: `js/pages/` - Individual page components (login, dashboard, admin, etc.)
- Services: `js/services/api.js` - Backend API communication
- Config: `js/config.js` - API endpoints and configuration
- Uses Leaflet.js for maps, Chart.js for analytics, QRCode.js for tickets

### Backend (Express.js)
- Entry point: `server.js`
- Routes: `routes/` - REST API endpoints (auth, users, buses, routes, tickets, feedback, analytics)
- Config: `config/database.js` (PostgreSQL), `config/blockchain.js` (Ethers.js setup)
- Middleware: `middleware/auth.js` - JWT authentication
- Services: `services/websocket.js` - Real-time bus location updates

### Database (PostgreSQL)
Tables: users, routes, stops, buses, tickets, feedback
- Tickets are stored in PostgreSQL AND minted as NFTs on blockchain
- Bus locations updated via WebSocket for real-time tracking

### Blockchain (Solidity/Hardhat)
- Smart contract: `contracts/TicketNFT.sol` - ERC-721 for ticket NFTs
- Deploy script: `scripts/deploy.js`
- Contract address stored in backend `.env` after deployment

## API Authentication

All protected routes require JWT token:
```
Authorization: Bearer <token>
```

## Environment Variables

Backend `.env` required:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=city_linkers
DB_USER=postgres
DB_PASSWORD=<your_password>
JWT_SECRET=<your_secret>
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=<from_deploy>
FRONTEND_URL=http://localhost:5173
```

## Demo Credentials

- User: `john@example.com` / `password123`
- Admin: `admin@citylinkers.com` / `admin123`

## Prerequisites

- Node.js v18+
- PostgreSQL v14+ (`brew install postgresql@14`)
- Python 3 (for frontend server)

## Log Files

Logs are stored in `logs/`:
- `blockchain.log` - Hardhat node output
- `backend.log` - Express server logs
- `db-setup.log`, `db-seed.log` - Database operations