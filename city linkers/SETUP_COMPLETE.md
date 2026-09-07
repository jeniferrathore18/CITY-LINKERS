# 🎉 City Linkers Web Application - Setup Complete

## ✅ Installation Summary

### 1. PostgreSQL 14
- **Status**: ✅ Installed and Running
- **Installation**: `brew install postgresql@14`
- **Service**: Started via `brew services start postgresql@14`
- **Database**: `city_linkers` created and seeded
- **User**: `jeniferrathore` (no password required for local development)

### 2. Node.js 20
- **Status**: ✅ Installed
- **Installation**: `brew install node@20`
- **Path**: `/opt/homebrew/opt/node@20/bin`
- **Version**: v20.19.5

### 3. Backend Server
- **Status**: ✅ Running
- **Port**: 5001 (changed from 5000 due to macOS ControlCenter conflict)
- **URL**: http://localhost:5001
- **Health Check**: http://localhost:5001/health
- **Environment**: Development
- **Database**: Connected to PostgreSQL
- **WebSocket**: Initialized and ready

### 4. Frontend Server
- **Status**: ✅ Running
- **Port**: 5173
- **URL**: http://localhost:5173
- **Server**: Python3 HTTP Server

---

## 🚀 Running the Application

### Start All Servers
```bash
./start-app.sh
```

### Stop All Servers
```bash
./stop-app.sh
```

### Manual Start (if needed)
```bash
# Backend
cd backend
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
node server.js

# Frontend (in another terminal)
python3 -m http.server 5173
```

---

## 📍 Service URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5173 | ✅ Running |
| Backend API | http://localhost:5001 | ✅ Running |
| Health Check | http://localhost:5001/health | ✅ Running |
| WebSocket | ws://localhost:5001 | ✅ Running |

---

## 🗄️ Database Information

### Connection Details
- **Host**: localhost
- **Port**: 5432
- **Database**: city_linkers
- **User**: jeniferrathore
- **Password**: (empty for local development)

### Tables Created
- `users` - User accounts and authentication
- `buses` - Bus fleet information
- `routes` - Transit routes and stops
- `tickets` - E-ticket purchases and validation
- `feedback` - User feedback and ratings
- `analytics` - System analytics and metrics

### Sample Data
The database has been seeded with sample data including:
- Admin user (admin@citylinkers.com / admin123)
- Sample bus routes
- Test buses with GPS tracking
- Demo tickets

---

## 🔧 Configuration Files

### Backend Environment (.env)
```
PORT=5001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=city_linkers
DB_USER=jeniferrathore
DB_PASSWORD=
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
WS_PORT=5001
```

### API Configuration (js/services/api.js)
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
const WS_URL = 'ws://localhost:5001';
```

---

## 📝 Important Notes

### Port 5000 Conflict
- macOS ControlCenter uses port 5000 by default
- Backend has been configured to use port 5001 instead
- All frontend API calls updated to use port 5001

### PostgreSQL Path
- PostgreSQL 14 is installed at `/opt/homebrew/opt/postgresql@14`
- The PATH must be set before running backend commands
- This is automatically handled by `start-app.sh`

### Node.js Path
- Node.js 20 is keg-only (not symlinked)
- Located at `/opt/homebrew/opt/node@20`
- PATH must be set before running npm/node commands
- This is automatically handled by `start-app.sh`

---

## 🧪 Testing the Application

### 1. Check Backend Health
```bash
curl http://localhost:5001/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-09-30T...",
  "uptime": 123.456
}
```

### 2. Access Frontend
Open your browser and navigate to:
```
http://localhost:5173
```

### 3. Test Login
Use the admin credentials:
- **Email**: admin@citylinkers.com
- **Password**: admin123

---

## 📊 Process Management

### View Running Processes
```bash
# Backend
lsof -i :5001

# Frontend
lsof -i :5173

# PostgreSQL
pg_isready
```

### Kill Specific Processes
```bash
# Kill backend
lsof -ti:5001 | xargs kill -9

# Kill frontend
lsof -ti:5173 | xargs kill -9
```

---

## 🐛 Troubleshooting

### Backend Won't Start
1. Check if port 5001 is available: `lsof -i :5001`
2. Verify PostgreSQL is running: `pg_isready`
3. Check backend logs: `tail -f logs/backend.log`
4. Ensure Node.js is in PATH: `which node`

### Frontend Won't Start
1. Check if port 5173 is available: `lsof -i :5173`
2. Verify Python3 is installed: `which python3`
3. Check frontend logs: `tail -f logs/frontend.log`

### Database Connection Issues
1. Verify PostgreSQL is running: `brew services list | grep postgresql`
2. Test database connection: `psql -d city_linkers -U jeniferrathore`
3. Check database exists: `psql -l | grep city_linkers`

### Port 5000 Still in Use
If you see "EADDRINUSE" errors:
```bash
# Check what's using port 5000
lsof -i :5000

# It's likely macOS ControlCenter - use port 5001 instead
```

---

## 🎯 Next Steps

1. **Open the application**: http://localhost:5173
2. **Login with admin credentials**
3. **Explore the features**:
   - Real-time bus tracking
   - E-ticket purchasing
   - Route planning
   - Analytics dashboard
   - User feedback system

4. **Development**:
   - Backend code is in `backend/`
   - Frontend code is in `js/`
   - Styles are in `styles.css`
   - Main HTML is `index.html`

---

## 📚 Additional Resources

- **Quick Start Guide**: `QUICK_START.md`
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Backend Integration**: `BACKEND_INTEGRATION.md`
- **Admin Dashboard**: `ADMIN_DASHBOARD_REALTIME.md`
- **File Structure**: `FILE_STRUCTURE.md`

---

**Last Updated**: September 30, 2025, 09:12 AM IST
**Status**: ✅ All Systems Operational
