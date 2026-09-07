# City Linkers Backend API

Backend server for City Linkers Transit System with PostgreSQL database and Blockchain integration.

## 🏗️ Architecture

```
Frontend Server (Port 5173)
    ↓
Backend API Server (Port 5000)
    ↓
├── PostgreSQL Database (Port 5432)
└── Blockchain Node (Port 8545)
```

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Hardhat blockchain node running

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=city_linkers
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
FRONTEND_URL=http://localhost:5173
```

### 3. Setup Database

```bash
# Create database and tables
npm run db:setup

# Seed initial data
npm run db:seed
```

### 4. Start Blockchain (in separate terminal)

```bash
cd ../blockchain
npm run node
```

### 5. Start Backend Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js          # PostgreSQL configuration
│   └── blockchain.js        # Blockchain/Ethers.js setup
├── routes/
│   ├── auth.js             # Authentication endpoints
│   ├── users.js            # User management
│   ├── buses.js            # Bus tracking
│   ├── routes.js           # Route management
│   ├── tickets.js          # Ticket operations
│   ├── feedback.js         # User feedback
│   └── analytics.js        # Dashboard analytics
├── middleware/
│   └── auth.js             # JWT authentication
├── services/
│   └── websocket.js        # Real-time updates
├── scripts/
│   ├── setupDatabase.js    # Database initialization
│   └── seed.js             # Seed data
├── server.js               # Main server file
├── package.json
└── .env
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Buses
- `GET /api/buses` - Get all buses
- `GET /api/buses/:id` - Get specific bus
- `GET /api/buses/route/:routeId` - Get buses on route
- `PUT /api/buses/:id/location` - Update bus location (admin)

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route details
- `GET /api/routes/:id/stops` - Get stops for route

### Tickets
- `POST /api/tickets/purchase` - Purchase ticket (blockchain)
- `GET /api/tickets/user/:userId` - Get user tickets
- `GET /api/tickets/:id/verify` - Verify ticket on blockchain

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback (admin)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats (admin)
- `GET /api/analytics/revenue` - Get revenue data (admin)

## 🔐 Authentication

All protected routes require JWT token in header:

```
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### Users
```sql
id, name, email, phone, password_hash, role, created_at
```

### Routes
```sql
id, name, description, fare_base, fare_per_stop, active
```

### Stops
```sql
id, route_id, name, latitude, longitude, sequence_order
```

### Buses
```sql
id, route_id, capacity, current_occupancy, latitude, longitude, speed, status
```

### Tickets
```sql
id, ticket_id, user_id, route_id, from_stop_id, to_stop_id, 
passengers, fare, blockchain_tx_hash, blockchain_token_id, status
```

### Feedback
```sql
id, user_id, rating, feedback_text, email, created_at
```

## ⛓️ Blockchain Integration

Tickets are minted as NFTs on the blockchain:

1. User purchases ticket
2. Backend creates ticket in PostgreSQL
3. Backend mints NFT on blockchain
4. Transaction hash stored in database
5. QR code generated with blockchain proof

## 🔄 WebSocket Events

Real-time updates on `ws://localhost:5001`:

- `bus-location-update` - Bus GPS updates
- `route-update` - Route changes
- `ticket-minted` - New ticket created

## 🧪 Testing

```bash
# Test database connection
npm run db:setup

# Test API endpoints
curl http://localhost:5000/health
```

## 📊 Monitoring

Health check endpoint:
```
GET /health
```

Returns:
```json
{
  "status": "OK",
  "timestamp": "2025-09-30T00:00:00.000Z",
  "uptime": 12345
}
```

## 🔧 Development

```bash
# Start with auto-reload
npm run dev

# View logs
npm run dev | pino-pretty
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use proper PostgreSQL credentials
3. Deploy blockchain to testnet/mainnet
4. Use PM2 or Docker for process management
5. Setup NGINX as reverse proxy
6. Enable HTTPS with SSL certificates

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Backend server port | 5000 |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | city_linkers |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| JWT_SECRET | JWT signing key | - |
| BLOCKCHAIN_RPC_URL | Blockchain RPC endpoint | http://127.0.0.1:8545 |
| CONTRACT_ADDRESS | Smart contract address | - |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

## 🐛 Troubleshooting

**Database connection error:**
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env`

**Blockchain connection error:**
- Ensure Hardhat node is running
- Check CONTRACT_ADDRESS is correct

**JWT errors:**
- Verify JWT_SECRET is set
- Check token expiration

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [JWT Best Practices](https://jwt.io/introduction)

## 👥 Support

For issues or questions, contact the development team.
