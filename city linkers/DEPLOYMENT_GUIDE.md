# City Linkers - Complete Deployment Guide

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CITY LINKERS SYSTEM                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend Server (Port 5173)                                │
│  └── Static files, HTML, CSS, JavaScript                    │
│                                                              │
│  Backend API Server (Port 5000)                             │
│  ├── Express.js REST API                                    │
│  ├── JWT Authentication                                     │
│  ├── WebSocket Server (Real-time updates)                  │
│  └── Blockchain Integration                                │
│                                                              │
│  PostgreSQL Database (Port 5432)                            │
│  └── User data, tickets, routes, buses, feedback           │
│                                                              │
│  Blockchain Node (Port 8545)                                │
│  └── Hardhat local node / Ethereum testnet                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

### Required Software
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** v14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Optional
- **Docker** (for containerized deployment)
- **PM2** (for process management)
- **NGINX** (for reverse proxy)

## 🚀 Step-by-Step Setup

### 1. Clone/Setup Project

```bash
cd "/Users/jeniferrathore/Desktop/city linkers"
```

### 2. Setup PostgreSQL Database

#### Install PostgreSQL (if not installed)
```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download installer from postgresql.org
```

#### Create Database User
```bash
# Connect to PostgreSQL
psql postgres

# Create user and database
CREATE USER citylinkers WITH PASSWORD 'your_secure_password';
CREATE DATABASE city_linkers OWNER citylinkers;
GRANT ALL PRIVILEGES ON DATABASE city_linkers TO citylinkers;
\q
```

### 3. Setup Blockchain

```bash
cd blockchain
npm install
npm run node
```

**Keep this terminal running!**

In a new terminal:
```bash
cd blockchain
npm run deploy:local
```

Copy the contract address from output.

### 4. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=city_linkers
DB_USER=citylinkers
DB_PASSWORD=your_secure_password

JWT_SECRET=generate_random_secret_key_here
JWT_EXPIRES_IN=7d

BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=<paste_contract_address_here>
CHAIN_ID=31337

FRONTEND_URL=http://localhost:5173
WS_PORT=5001
```

Initialize database:
```bash
npm run db:setup
npm run db:seed
```

Start backend server:
```bash
npm run dev
```

### 5. Setup Frontend

The frontend is already configured. Just start the server:

```bash
cd "/Users/jeniferrathore/Desktop/city linkers"
python3 -m http.server 5173
```

Or use a proper web server:
```bash
npm install -g http-server
http-server -p 5173
```

## 🔧 Configuration

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend API port | 5000 |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | city_linkers |
| DB_USER | Database user | citylinkers |
| DB_PASSWORD | Database password | secure_password |
| JWT_SECRET | JWT signing key | random_32_char_string |
| BLOCKCHAIN_RPC_URL | Blockchain endpoint | http://127.0.0.1:8545 |
| CONTRACT_ADDRESS | Smart contract address | 0x5FbDB... |
| FRONTEND_URL | Frontend URL (CORS) | http://localhost:5173 |

### Frontend API Configuration

Update frontend to use backend API. Create `js/config/api.js`:

```javascript
export const API_BASE_URL = 'http://localhost:5000/api';
export const WS_URL = 'ws://localhost:5000';
```

## 🧪 Testing the Setup

### 1. Test Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-09-30T00:00:00.000Z",
  "uptime": 123
}
```

### 2. Test Database Connection
```bash
cd backend
node -e "import('./config/database.js').then(db => db.query('SELECT NOW()').then(r => console.log('DB OK:', r.rows[0])))"
```

### 3. Test Authentication
```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Sign in
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","password":"test123"}'
```

### 4. Test Frontend
Open browser: `http://localhost:5173`

## 📊 Database Schema

### Tables Created
- `users` - User accounts
- `routes` - Bus routes
- `stops` - Bus stops
- `buses` - Bus fleet
- `tickets` - Purchased tickets
- `feedback` - User feedback
- `trip_history` - Trip records

### Sample Data
- 3 demo users (john, jane, admin)
- 3 routes (R1, R2, R3)
- Multiple stops per route
- 5 active buses

## 🔐 Security Considerations

### Production Checklist
- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS with SSL certificates
- [ ] Use environment variables (never commit .env)
- [ ] Enable rate limiting
- [ ] Set up CORS properly
- [ ] Use prepared statements (already done)
- [ ] Enable PostgreSQL SSL
- [ ] Deploy blockchain to testnet/mainnet
- [ ] Use proper private key management
- [ ] Enable database backups
- [ ] Set up monitoring and logging

## 🚀 Production Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name city-linkers-api

# Start blockchain
cd blockchain
pm2 start "npm run node" --name city-linkers-blockchain

# Save PM2 configuration
pm2 save
pm2 startup
```

### Using Docker

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: city_linkers
      POSTGRES_USER: citylinkers
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Run:
```bash
docker-compose up -d
```

### NGINX Reverse Proxy

```nginx
server {
    listen 80;
    server_name citylinkers.com;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login
- `GET /api/auth/verify` - Verify token

### User Endpoints
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile

### Bus Endpoints
- `GET /api/buses` - Get all buses
- `GET /api/buses/route/:routeId` - Get buses by route

### Route Endpoints
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id/stops` - Get route stops

### Ticket Endpoints
- `POST /api/tickets/purchase` - Purchase ticket
- `GET /api/tickets/user/:userId` - Get user tickets
- `GET /api/tickets/:id/verify` - Verify on blockchain

### Feedback Endpoints
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback (admin)

### Analytics Endpoints (Admin)
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/revenue` - Revenue data

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `pg_isready`
- Verify .env file exists and has correct values
- Check port 5000 is not in use: `lsof -i :5000`

### Database connection error
- Verify PostgreSQL credentials
- Check database exists: `psql -l`
- Test connection: `psql -U citylinkers -d city_linkers`

### Blockchain errors
- Ensure Hardhat node is running
- Verify CONTRACT_ADDRESS in .env
- Check RPC URL is correct

### Frontend can't connect to backend
- Check CORS settings in backend
- Verify API_BASE_URL in frontend
- Check browser console for errors

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Ethers.js Docs](https://docs.ethers.org/)
- [Hardhat Docs](https://hardhat.org/docs)

## 👥 Support

For issues or questions:
- Check logs: `pm2 logs city-linkers-api`
- Database logs: `tail -f /var/log/postgresql/postgresql-14-main.log`
- Backend logs: Check console output

## ✅ Deployment Checklist

- [ ] PostgreSQL installed and running
- [ ] Database created and seeded
- [ ] Blockchain node running
- [ ] Smart contract deployed
- [ ] Backend .env configured
- [ ] Backend server running
- [ ] Frontend server running
- [ ] All health checks passing
- [ ] Test user signup/signin
- [ ] Test ticket purchase
- [ ] Test blockchain verification
- [ ] WebSocket connection working

Your City Linkers system is now ready! 🚀
