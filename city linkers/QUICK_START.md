# 🚀 Quick Start Guide - City Linkers

## ⚡ Fastest Way to Run (Frontend Only)

If you just want to see the frontend without backend/database:

### Step 1: Start Frontend Server

Open Terminal and run:

```bash
cd "/Users/jeniferrathore/Desktop/city linkers"
python3 -m http.server 5173
```

### Step 2: Open Browser

Open your browser and go to:
```
http://localhost:5173
```

**Note:** The app will work with mock data (no backend needed for basic functionality).

---

## 🔧 Full System Setup (With Backend + Database)

### Prerequisites

1. **Install PostgreSQL**
```bash
# macOS
brew install postgresql@14
brew services start postgresql@14
```

2. **Create Database**
```bash
psql postgres

# In PostgreSQL prompt:
CREATE USER citylinkers WITH PASSWORD 'password123';
CREATE DATABASE city_linkers OWNER citylinkers;
GRANT ALL PRIVILEGES ON DATABASE city_linkers TO citylinkers;
\q
```

### Setup Steps

#### 1. Setup Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=city_linkers
DB_USER=citylinkers
DB_PASSWORD=password123

JWT_SECRET=your_random_secret_key_change_this_in_production_32chars
JWT_EXPIRES_IN=7d

BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
CHAIN_ID=31337

FRONTEND_URL=http://localhost:5173
WS_PORT=5001
```

#### 2. Initialize Database

```bash
cd backend
npm run db:setup
npm run db:seed
```

#### 3. Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend will run on: http://localhost:5000

#### 4. Start Frontend (Terminal 2)

```bash
cd "/Users/jeniferrathore/Desktop/city linkers"
python3 -m http.server 5173
```

Frontend will run on: http://localhost:5173

#### 5. (Optional) Start Blockchain (Terminal 3)

```bash
cd blockchain
npm install
npm run node
```

---

## 🧪 Test the Setup

### Test Frontend
Open browser: http://localhost:5173

### Test Backend
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "...",
  "uptime": 123
}
```

---

## 🔑 Demo Login Credentials

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

---

## 🐛 Troubleshooting

### "Site can't be reached"

**Problem:** Frontend server not running

**Solution:**
```bash
cd "/Users/jeniferrathore/Desktop/city linkers"
python3 -m http.server 5173
```

### "Port already in use"

**Problem:** Port 5173 is occupied

**Solution:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
python3 -m http.server 8080
# Then open http://localhost:8080
```

### Backend not connecting

**Problem:** Backend server not running

**Solution:**
```bash
cd backend
npm run dev
```

### Database connection error

**Problem:** PostgreSQL not running or wrong credentials

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL
brew services start postgresql@14

# Test connection
psql -U citylinkers -d city_linkers
```

---

## 📝 Common Commands

### Start Frontend
```bash
python3 -m http.server 5173
```

### Start Backend
```bash
cd backend && npm run dev
```

### Stop All Servers
```bash
# Kill frontend
lsof -ti:5173 | xargs kill -9

# Kill backend
lsof -ti:5000 | xargs kill -9

# Kill blockchain
lsof -ti:8545 | xargs kill -9
```

### Check Running Servers
```bash
# Check port 5173 (frontend)
lsof -i :5173

# Check port 5000 (backend)
lsof -i :5000

# Check port 5432 (PostgreSQL)
lsof -i :5432
```

---

## 🎯 What Works Without Backend

The following features work with just the frontend (mock data):

✅ Home page
✅ Live bus tracking (simulated)
✅ Route information
✅ Basic ticket purchase (mock blockchain)
✅ Dashboard (mock data)

## 🎯 What Requires Backend

The following features require backend + database:

❌ Real user authentication
❌ Persistent ticket storage
❌ Real blockchain transactions
❌ User profile management
❌ Feedback submission to database
❌ Real-time analytics

---

## ✅ Quick Checklist

- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can see welcome page
- [ ] Can navigate to User Portal
- [ ] Can sign in (mock or real)

For full functionality:
- [ ] PostgreSQL installed and running
- [ ] Backend .env configured
- [ ] Database created and seeded
- [ ] Backend running on port 5000
- [ ] Can access http://localhost:5000/health

---

## 🆘 Still Having Issues?

1. **Check if port is in use:**
   ```bash
   lsof -i :5173
   ```

2. **Try different port:**
   ```bash
   python3 -m http.server 8080
   ```

3. **Check file permissions:**
   ```bash
   ls -la index.html
   ```

4. **View server logs:**
   - Frontend: Check terminal where you ran python command
   - Backend: Check terminal where you ran npm run dev

---

## 📚 More Help

- [Complete Setup Guide](COMPLETE_SETUP_SUMMARY.md)
- [Backend Documentation](backend/README.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)

---

**Your frontend is now running at: http://localhost:5173** 🎉
