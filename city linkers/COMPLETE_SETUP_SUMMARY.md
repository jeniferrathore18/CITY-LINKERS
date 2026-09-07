# 🚀 City Linkers - Complete Backend & Frontend Integration

## ✅ What Has Been Created

### 1. **Backend Server (Node.js + Express + PostgreSQL + Blockchain)**

#### File Structure:
```
backend/
├── server.js                    # Main Express server
├── package.json                 # Dependencies
├── .env.example                 # Environment template
├── config/
│   ├── database.js             # PostgreSQL connection
│   └── blockchain.js           # Ethereum/Hardhat integration
├── routes/
│   ├── auth.js                 # Authentication (signup/signin)
│   ├── users.js                # User management
│   ├── buses.js                # Bus tracking
│   ├── routes.js               # Route management
│   ├── tickets.js              # Ticket purchase & blockchain
│   ├── feedback.js             # User feedback
│   └── analytics.js            # Dashboard analytics
├── middleware/
│   └── auth.js                 # JWT authentication
├── services/
│   └── websocket.js            # Real-time updates
├── scripts/
│   ├── setupDatabase.js        # Database initialization
│   └── seed.js                 # Seed demo data
└── README.md                    # Backend documentation
```

#### Features:
- ✅ RESTful API with Express.js
- ✅ PostgreSQL database with connection pooling
- ✅ JWT authentication
- ✅ Blockchain integration (Hardhat/Ethers.js)
- ✅ WebSocket for real-time updates
- ✅ CORS configured
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ Request logging (Morgan)
- ✅ Error handling

### 2. **Frontend API Integration**

#### New Files:
```
js/services/
└── api.js                      # API service layer
```

#### Updated Files:
- `js/pages/userLogin.js` - Now uses backend API
- `js/pages/adminLogin.js` - Ready for backend integration

#### Features:
- ✅ Centralized API service
- ✅ JWT token management
- ✅ WebSocket connection
- ✅ Fallback to mock data
- ✅ Error handling

### 3. **Database Schema**

#### Tables:
- **users** - User accounts (name, email, phone, password, role)
- **routes** - Bus routes (id, name, fare)
- **stops** - Bus stops (route_id, name, lat/lng, sequence)
- **buses** - Bus fleet (id, route_id, location, occupancy)
- **tickets** - Purchased tickets (user_id, route_id, blockchain_tx)
- **feedback** - User feedback (rating, text, email)
- **trip_history** - Trip records

### 4. **Blockchain Integration**

- Smart contract for ticket NFTs
- Transaction hash storage
- Blockchain verification
- Ethers.js integration

## 🚀 Quick Start Guide

### Step 1: Install PostgreSQL

```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Create database
psql postgres
CREATE USER citylinkers WITH PASSWORD 'your_password';
CREATE DATABASE city_linkers OWNER citylinkers;
\q
```

### Step 2: Setup Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings
nano .env
```

**.env Configuration:**
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=city_linkers
DB_USER=citylinkers
DB_PASSWORD=your_password
JWT_SECRET=your_random_secret_key_32_chars
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
FRONTEND_URL=http://localhost:5173
```

### Step 3: Initialize Database

```bash
# Create tables
npm run db:setup

# Seed demo data
npm run db:seed
```

### Step 4: Start Blockchain (Optional)

```bash
# In new terminal
cd ../blockchain
npm install
npm run node

# In another terminal
npm run deploy:local
```

### Step 5: Start Backend

```bash
cd backend
npm run dev
```

Backend runs on: **http://localhost:5000**

### Step 6: Start Frontend

```bash
cd "/Users/jeniferrathore/Desktop/city linkers"
python3 -m http.server 5173
```

Frontend runs on: **http://localhost:5173**

## 🧪 Testing the System

### 1. Test Backend Health

```bash
curl http://localhost:5000/health
```

Expected:
```json
{
  "status": "OK",
  "timestamp": "2025-09-30T00:00:00.000Z",
  "uptime": 123
}
```

### 2. Test User Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 3. Test User Signin

```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "test123"
  }'
```

### 4. Test Frontend

1. Open: http://localhost:5173
2. Click "User Portal"
3. Sign up with new account
4. Or sign in with: `john@example.com` / `password123`

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/signup      - Create account
POST   /api/auth/signin      - Login
GET    /api/auth/verify      - Verify token
```

### Users
```
GET    /api/users/profile    - Get profile (auth required)
PUT    /api/users/profile    - Update profile (auth required)
```

### Buses
```
GET    /api/buses            - Get all buses
GET    /api/buses/route/:id  - Get buses by route
PUT    /api/buses/:id/location - Update location (admin)
```

### Routes
```
GET    /api/routes           - Get all routes
GET    /api/routes/:id       - Get route details
GET    /api/routes/:id/stops - Get route stops
```

### Tickets
```
POST   /api/tickets/purchase - Purchase ticket (auth + blockchain)
GET    /api/tickets/user/:id - Get user tickets (auth)
GET    /api/tickets/:id/verify - Verify on blockchain
GET    /api/tickets          - Get all tickets (admin)
```

### Feedback
```
POST   /api/feedback         - Submit feedback
GET    /api/feedback         - Get all feedback (admin)
```

### Analytics (Admin Only)
```
GET    /api/analytics/dashboard - Dashboard stats
GET    /api/analytics/revenue   - Revenue data
```

## 🔐 Authentication Flow

### Sign Up:
1. User submits name, email/phone, password
2. Backend hashes password (bcrypt)
3. Stores in PostgreSQL
4. Returns JWT token
5. Frontend stores token in sessionStorage

### Sign In:
1. User submits email/phone, password
2. Backend verifies credentials
3. Returns JWT token
4. Frontend stores token
5. Token included in all API requests

### Protected Routes:
```javascript
Authorization: Bearer <jwt_token>
```

## 🎫 Ticket Purchase Flow (with Blockchain)

1. User selects route, stops, passengers
2. Frontend calculates fare
3. Sends purchase request to backend
4. Backend:
   - Validates data
   - Creates ticket in PostgreSQL
   - Mints NFT on blockchain
   - Stores transaction hash
5. Returns ticket with blockchain proof
6. Frontend displays QR code

## 🔄 Real-Time Updates (WebSocket)

```javascript
import { connectWebSocket } from './js/services/api.js';

// Connect to WebSocket
const ws = connectWebSocket((data) => {
  switch(data.type) {
    case 'bus-location-update':
      // Update bus on map
      break;
    case 'ticket-minted':
      // Show notification
      break;
  }
});
```

## 🗄️ Database Schema

### Users Table
```sql
id SERIAL PRIMARY KEY
name VARCHAR(255)
email VARCHAR(255) UNIQUE
phone VARCHAR(20) UNIQUE
password_hash VARCHAR(255)
role VARCHAR(50) DEFAULT 'user'
created_at TIMESTAMP
```

### Tickets Table
```sql
id SERIAL PRIMARY KEY
ticket_id VARCHAR(100) UNIQUE
user_id INT REFERENCES users(id)
route_id VARCHAR(50)
from_stop_id INT
to_stop_id INT
passengers INT
fare DECIMAL(10,2)
blockchain_tx_hash VARCHAR(255)
blockchain_token_id VARCHAR(100)
status VARCHAR(50)
created_at TIMESTAMP
```

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
DB_HOST=your-db-host
DB_PASSWORD=strong-password
JWT_SECRET=random-32-char-string
BLOCKCHAIN_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
FRONTEND_URL=https://citylinkers.com
```

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name city-linkers-api
pm2 save
pm2 startup
```

### Using Docker
```bash
docker-compose up -d
```

## 🔧 Configuration Options

### Frontend API Toggle

In `js/pages/userLogin.js`:
```javascript
const USE_BACKEND = true; // Set to false for mock data
```

### Backend Features

- **Rate Limiting**: 100 requests per 15 minutes
- **CORS**: Configured for frontend URL
- **JWT Expiry**: 7 days (configurable)
- **Database Pool**: Max 20 connections
- **WebSocket**: Auto-reconnect on disconnect

## 📝 Demo Credentials

### Users:
```
Email: john@example.com
Password: password123

Email: jane@example.com
Password: password123
```

### Admin:
```
Email: admin@citylinkers.com
Password: admin123
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check PostgreSQL
pg_isready

# Check port
lsof -i :5000

# Check logs
npm run dev
```

### Database errors
```bash
# Test connection
psql -U citylinkers -d city_linkers

# Reset database
npm run db:setup
npm run db:seed
```

### Frontend can't connect
- Check backend is running on port 5000
- Check CORS settings in backend/.env
- Check browser console for errors
- Verify API_BASE_URL in js/services/api.js

## ✅ Complete System Checklist

- [ ] PostgreSQL installed and running
- [ ] Database created (city_linkers)
- [ ] Backend dependencies installed
- [ ] Backend .env configured
- [ ] Database tables created (npm run db:setup)
- [ ] Demo data seeded (npm run db:seed)
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 5173)
- [ ] Can access http://localhost:5173
- [ ] Can sign up new user
- [ ] Can sign in existing user
- [ ] Can view routes and buses
- [ ] Can purchase tickets
- [ ] Admin can access dashboard

## 📚 Additional Documentation

- Backend API: `backend/README.md`
- Deployment Guide: `DEPLOYMENT_GUIDE.md`
- Blockchain Setup: `blockchain/README.md`

## 🎉 System is Ready!

You now have:
- ✅ Separate frontend server (port 5173)
- ✅ Separate backend server (port 5000)
- ✅ PostgreSQL database
- ✅ Blockchain integration
- ✅ Real-time WebSocket
- ✅ JWT authentication
- ✅ Complete API
- ✅ Admin dashboard
- ✅ User portal

**Start all servers and enjoy your City Linkers Transit System!** 🚌🚀
