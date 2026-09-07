# City Linkers - Smart Transit System

A complete modern transit system with **real-time GPS tracking**, **blockchain e-ticketing**, **PostgreSQL database**, and **separate frontend/backend servers**.

## System Architecture

```
Frontend (Port 5173) ←→ Backend API (Port 5000) ←→ PostgreSQL (Port 5432)
                                ↓
                         Blockchain (Port 8545)
```

## ✨ Features

### User Portal
- 🗺️ Real-time GPS bus tracking with live map
- 🎫 Blockchain-backed e-ticketing with QR codes
- 📍 Nearest bus stops with geolocation
- 🚌 Route planning and journey optimization
- ⭐ Feedback system with star ratings
- 📱 Fully responsive mobile-first design

### Admin Portal
- 📊 Comprehensive analytics dashboard
- 🚍 Bus fleet management
- 💰 Revenue tracking and reports
- 👥 User management
- 📝 Feedback monitoring

### Technical Features
- 🔐 JWT authentication with role-based access
- ⛓️ Ethereum blockchain integration (Hardhat)
- 🗄️ PostgreSQL database with connection pooling
- 🔄 WebSocket for real-time updates
- 🛡️ Security headers and rate limiting
- 📡 RESTful API with Express.js

## 🚀 Quick Start

### One-Command Start (Recommended)

```bash
./start-all.sh
```

This will start:
- PostgreSQL database
- Blockchain node
- Backend API server
- Frontend web server

Then open: **http://localhost:5173**

### Manual Start

#### 1. Setup PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql@14  # macOS
brew services start postgresql@14

# Create database
psql postgres
CREATE USER citylinkers WITH PASSWORD 'your_password';
CREATE DATABASE city_linkers OWNER citylinkers;
\q
```

#### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run db:setup
npm run db:seed
npm run dev
```

#### 3. Start Blockchain
```bash
cd blockchain
npm install
npm run node  # Keep running
# In new terminal:
npm run deploy:local
```

#### 4. Start Frontend
```bash
python3 -m http.server 5173
```

## 📚 Documentation

- **[Complete Setup Guide](COMPLETE_SETUP_SUMMARY.md)** - Full system setup
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment
- **[Backend API](backend/README.md)** - API documentation
- **[Blockchain](blockchain/README.md)** - Smart contract details

## 🧪 Demo Credentials

### User Portal
```
Email: john@example.com
Password: password123
```

### Admin Portal
```
Email: admin@citylinkers.com
Password: admin123
```

## 📁 Project Structure

```
city-linkers/
├── frontend/                 # Frontend application
│   ├── index.html
│   ├── styles.css
│   └── js/
│       ├── pages/           # Page components
│       ├── services/        # API services
│       ├── utils/           # Utilities
│       └── data/            # Mock data
├── backend/                 # Backend API server
│   ├── server.js
│   ├── routes/             # API routes
│   ├── config/             # Database & blockchain config
│   ├── middleware/         # Auth middleware
│   ├── services/           # WebSocket service
│   └── scripts/            # Database scripts
├── blockchain/             # Hardhat blockchain
│   ├── contracts/          # Smart contracts
│   ├── scripts/            # Deployment scripts
│   └── hardhat.config.js
├── start-all.sh           # Start all servers
├── stop-all.sh            # Stop all servers
└── README.md              # This file
```

## 🔧 Tech Stack

### Frontend
- Vanilla JavaScript (ES Modules)
- Leaflet.js for maps
- Chart.js for analytics
- QRCode.js for ticket QR codes
- Modern CSS with glassmorphism

### Backend
- Node.js + Express.js
- PostgreSQL database
- JWT authentication
- Ethers.js for blockchain
- WebSocket for real-time updates

### Blockchain
- Hardhat development environment
- Solidity smart contracts
- Local Ethereum node

## 🛑 Stop All Servers

```bash
./stop-all.sh
```

## 🐛 Troubleshooting

See [COMPLETE_SETUP_SUMMARY.md](COMPLETE_SETUP_SUMMARY.md#-troubleshooting) for detailed troubleshooting guide.

## 📝 License

MIT License

## 👥 Support

For issues or questions, check the documentation or create an issue.
