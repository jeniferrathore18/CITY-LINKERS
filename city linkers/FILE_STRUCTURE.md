# 📁 City Linkers - Complete File Structure

## 📂 Project Organization

```
city-linkers/
│
├── 📄 index.html                      # Main HTML entry point
├── 🎨 styles.css                      # Global styles and theme
├── 🖼️ logo.jpeg                       # Application logo
│
├── 📚 Documentation Files
│   ├── README.md                      # Main project documentation
│   ├── QUICK_START.md                 # Quick setup guide
│   ├── COMPLETE_SETUP_SUMMARY.md      # Full system setup
│   ├── DEPLOYMENT_GUIDE.md            # Production deployment
│   ├── LOGIN_GUIDE.md                 # Login instructions
│   ├── LOGIN_FIX.md                   # Login troubleshooting
│   ├── CURRENT_LOCATION_FIX.md        # Location feature docs
│   ├── FILE_STRUCTURE.md              # This file
│   ├── test-login.html                # Login test page
│   ├── start-all.sh                   # Start all servers script
│   └── stop-all.sh                    # Stop all servers script
│
├── 📁 js/                             # JavaScript modules
│   │
│   ├── 📄 app.js                      # Application entry point
│   ├── 📄 router.js                   # Hash-based router
│   ├── 📄 config.js                   # Configuration settings
│   │
│   ├── 📁 pages/                      # Page components
│   │   ├── welcome.js                 # Portal selection page
│   │   ├── userLogin.js               # User login/signup
│   │   ├── adminLogin.js              # Admin login
│   │   ├── home.js                    # Home/landing page
│   │   ├── tracking.js                # Live bus tracking
│   │   ├── ticketing.js               # E-ticketing system
│   │   └── dashboard.js               # Admin dashboard
│   │
│   ├── 📁 services/                   # Service layer
│   │   └── api.js                     # Backend API integration
│   │
│   ├── 📁 utils/                      # Utility functions
│   │   ├── ui.js                      # UI helpers (toast, nav)
│   │   └── map.js                     # Map utilities (Leaflet)
│   │
│   └── 📁 data/                       # Data layer
│       └── mock.js                    # Mock data & simulation
│
├── 📁 backend/                        # Backend API server
│   │
│   ├── 📄 server.js                   # Express server entry
│   ├── 📄 package.json                # Node dependencies
│   ├── 📄 .env.example                # Environment template
│   ├── 📄 .env                        # Environment config (create this)
│   ├── 📄 start.sh                    # Backend start script
│   ├── 📄 README.md                   # Backend documentation
│   │
│   ├── 📁 config/                     # Configuration
│   │   ├── database.js                # PostgreSQL setup
│   │   └── blockchain.js              # Ethereum/Hardhat setup
│   │
│   ├── 📁 routes/                     # API endpoints
│   │   ├── auth.js                    # Authentication routes
│   │   ├── users.js                   # User management
│   │   ├── buses.js                   # Bus tracking
│   │   ├── routes.js                  # Route management
│   │   ├── tickets.js                 # Ticket operations
│   │   ├── feedback.js                # User feedback
│   │   └── analytics.js               # Dashboard analytics
│   │
│   ├── 📁 middleware/                 # Express middleware
│   │   └── auth.js                    # JWT authentication
│   │
│   ├── 📁 services/                   # Business logic
│   │   └── websocket.js               # Real-time updates
│   │
│   └── 📁 scripts/                    # Database scripts
│       ├── setupDatabase.js           # Create tables
│       └── seed.js                    # Seed demo data
│
├── 📁 blockchain/                     # Blockchain layer
│   ├── 📄 hardhat.config.js           # Hardhat configuration
│   ├── 📄 package.json                # Blockchain dependencies
│   ├── 📄 README.md                   # Blockchain docs
│   ├── 📁 contracts/                  # Smart contracts
│   ├── 📁 scripts/                    # Deployment scripts
│   └── 📁 test/                       # Contract tests
│
└── 📁 logs/                           # Server logs (auto-created)
    ├── frontend.log
    ├── backend.log
    ├── blockchain.log
    └── pids.txt
```

## 📋 File Descriptions

### Root Level Files

#### **index.html**
- Main HTML entry point
- Loads all CSS and JavaScript modules
- Contains header, navigation, and footer
- Single-page application shell

#### **styles.css**
- Global CSS styles
- Theme variables (colors, spacing)
- Component styles (cards, buttons, forms)
- Responsive design (mobile, tablet, desktop)
- Glassmorphism effects

#### **logo.jpeg**
- Application logo image
- Displayed in header next to "City Linkers"
- Size: 40px height (34px on mobile)

### JavaScript Files

#### **js/app.js**
- Application initialization
- Router setup
- Auth state management
- Mock data simulation starter
- Event listeners for global UI

#### **js/router.js**
- Hash-based routing (#/page)
- Route protection (auth required)
- Page transitions
- 404 handling

#### **js/config.js**
- Configuration constants
- API endpoints
- Feature flags

### Page Components

#### **js/pages/welcome.js**
- Portal selection landing page
- User Portal card
- Admin Portal card
- Animated hover effects

#### **js/pages/userLogin.js**
- User authentication
- Sign in form
- Sign up form
- Mock data authentication
- Session management

#### **js/pages/adminLogin.js**
- Admin authentication
- Admin-only access
- Gradient styling
- Mock data authentication

#### **js/pages/home.js**
- Home page after login
- Statistics cards
- Feature highlights
- Call-to-action buttons

#### **js/pages/tracking.js**
- Live bus tracking map
- Journey planner
- Current location feature
- Nearest bus stops
- Route planning

#### **js/pages/ticketing.js**
- E-ticket purchase form
- Fare calculation
- QR code generation
- Blockchain integration
- Transaction history
- Feedback form

#### **js/pages/dashboard.js**
- Admin analytics dashboard
- Revenue charts
- User statistics
- Ticket management
- Feedback monitoring

### Services

#### **js/services/api.js**
- Backend API integration
- HTTP request wrapper
- Authentication headers
- WebSocket connection
- Error handling

### Utilities

#### **js/utils/ui.js**
- Toast notifications
- Mobile navigation toggle
- Loading states
- UI helper functions

#### **js/utils/map.js**
- Leaflet map initialization
- Bus marker updates
- Route visualization
- Map controls
- Layer management

### Data

#### **js/data/mock.js**
- Mock routes data
- Mock stops data
- Mock buses data
- Bus simulation
- Revenue data
- Event system

## 🗄️ Backend Structure

### Server Files

#### **backend/server.js**
- Express server setup
- Middleware configuration
- Route mounting
- Error handling
- WebSocket initialization

#### **backend/package.json**
- Node.js dependencies
- Scripts (start, dev, db:setup, db:seed)
- Project metadata

### Configuration

#### **backend/config/database.js**
- PostgreSQL connection pool
- Query helpers
- Transaction support
- Connection error handling

#### **backend/config/blockchain.js**
- Ethereum provider setup
- Smart contract interface
- Ticket minting functions
- Blockchain verification

### API Routes

#### **backend/routes/auth.js**
- POST /api/auth/signup - Create account
- POST /api/auth/signin - Login
- GET /api/auth/verify - Verify token

#### **backend/routes/users.js**
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update profile

#### **backend/routes/buses.js**
- GET /api/buses - Get all buses
- GET /api/buses/route/:id - Get buses by route
- PUT /api/buses/:id/location - Update location

#### **backend/routes/routes.js**
- GET /api/routes - Get all routes
- GET /api/routes/:id - Get route details
- GET /api/routes/:id/stops - Get stops

#### **backend/routes/tickets.js**
- POST /api/tickets/purchase - Purchase ticket
- GET /api/tickets/user/:id - Get user tickets
- GET /api/tickets/:id/verify - Verify blockchain

#### **backend/routes/feedback.js**
- POST /api/feedback - Submit feedback
- GET /api/feedback - Get all feedback (admin)

#### **backend/routes/analytics.js**
- GET /api/analytics/dashboard - Dashboard stats
- GET /api/analytics/revenue - Revenue data

### Middleware

#### **backend/middleware/auth.js**
- JWT token verification
- User authentication
- Admin role check
- Optional authentication

### Services

#### **backend/services/websocket.js**
- WebSocket server initialization
- Real-time bus updates
- Ticket minting broadcasts
- Client connection management

### Database Scripts

#### **backend/scripts/setupDatabase.js**
- Create database
- Create tables
- Create indexes
- Initial setup

#### **backend/scripts/seed.js**
- Seed demo users
- Seed routes and stops
- Seed buses
- Demo data population

## ⛓️ Blockchain Structure

### Configuration

#### **blockchain/hardhat.config.js**
- Solidity version
- Network configuration
- Path settings

#### **blockchain/package.json**
- Hardhat dependencies
- Scripts (compile, test, deploy, node)

### Directories

#### **blockchain/contracts/**
- Smart contract source files (.sol)
- Ticket NFT contract
- Registry contracts

#### **blockchain/scripts/**
- Deployment scripts
- Contract interaction scripts

#### **blockchain/test/**
- Contract unit tests
- Integration tests

## 📚 Documentation Files

### **README.md**
- Project overview
- Quick start guide
- Features list
- Tech stack
- Demo credentials

### **QUICK_START.md**
- Fastest way to run
- Frontend-only setup
- Full system setup
- Troubleshooting

### **COMPLETE_SETUP_SUMMARY.md**
- Detailed setup instructions
- Backend configuration
- Database setup
- API documentation
- Testing guide

### **DEPLOYMENT_GUIDE.md**
- Production deployment
- Environment variables
- PM2 setup
- Docker configuration
- NGINX setup

### **LOGIN_GUIDE.md**
- Login instructions
- Demo credentials
- Troubleshooting
- Browser settings

### **LOGIN_FIX.md**
- Login error fixes
- "Load failed" solution
- Emergency access
- Debug mode

### **CURRENT_LOCATION_FIX.md**
- Current location feature
- Geolocation setup
- Permission handling
- Error messages

## 🔧 Configuration Files

### **backend/.env**
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=city_linkers
DB_USER=citylinkers
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x...
FRONTEND_URL=http://localhost:5173
```

### **js/config.js**
```javascript
export const config = {
  apiBaseUrl: 'http://localhost:5000/api',
  wsUrl: 'ws://localhost:5000',
  mapCenter: [28.6139, 77.2090],
  mapZoom: 12
}
```

## 🚀 Startup Scripts

### **start-all.sh**
- Starts PostgreSQL check
- Starts blockchain node
- Deploys smart contract
- Starts backend server
- Starts frontend server
- Saves process IDs

### **stop-all.sh**
- Stops all running servers
- Kills processes by PID
- Cleans up resources

### **backend/start.sh**
- Checks .env file
- Installs dependencies
- Checks database
- Starts backend server

## 📊 Data Flow

```
User Browser
    ↓
index.html (Frontend)
    ↓
js/app.js (Router)
    ↓
js/pages/*.js (Components)
    ↓
js/services/api.js (API Layer)
    ↓
backend/server.js (Express API)
    ↓
backend/routes/*.js (Endpoints)
    ↓
├── backend/config/database.js → PostgreSQL
└── backend/config/blockchain.js → Ethereum
```

## 🔐 Authentication Flow

```
1. User enters credentials
2. userLogin.js validates
3. Creates session in sessionStorage
4. router.js checks auth on route change
5. app.js updates navigation UI
6. Protected pages accessible
```

## 🗺️ Map Integration

```
1. tracking.js initializes map
2. utils/map.js creates Leaflet instance
3. data/mock.js provides bus data
4. Bus markers update every 2 seconds
5. User can interact with map
```

## 🎫 Ticket Purchase Flow

```
1. User selects route and stops
2. ticketing.js calculates fare
3. Generates ticket ID
4. Creates QR code
5. (Optional) Mints on blockchain
6. Stores in session/database
7. Shows ticket with QR
```

## 📱 Responsive Design

### Breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations:
- Hamburger menu
- Stacked layouts
- Touch-friendly buttons
- Smaller fonts
- Compact cards

## 🎨 Styling System

### CSS Variables:
```css
--primary: #4F46E5
--secondary: #10B981
--text: #111827
--muted: #6B7280
--card: #FFFFFF
--stroke: rgba(17,24,39,0.12)
--spacing-sm: 12px
--spacing-md: 16px
--spacing-lg: 24px
--radius: 12px
```

### Component Classes:
- `.card` - Card container
- `.btn` - Button styles
- `.input` - Form inputs
- `.field` - Form field wrapper
- `.grid` - Grid layout
- `.section-title` - Section headers

## 🔄 Real-Time Updates

### WebSocket Events:
- `bus-location-update` - Bus GPS updates
- `ticket-minted` - New ticket created
- `route-update` - Route changes

### Event System:
```javascript
document.dispatchEvent(new CustomEvent('buses:update'))
document.addEventListener('buses:update', handler)
```

## 📦 Dependencies

### Frontend:
- Leaflet.js - Maps
- Chart.js - Analytics charts
- QRCode.js - QR code generation
- Vanilla JavaScript (ES6 modules)

### Backend:
- Express.js - Web framework
- PostgreSQL (pg) - Database
- Ethers.js - Blockchain
- JWT - Authentication
- bcrypt - Password hashing
- WebSocket (ws) - Real-time

### Blockchain:
- Hardhat - Development environment
- Solidity - Smart contracts
- Ethers.js - Contract interaction

## ✅ File Checklist

### Frontend Files:
- [x] index.html
- [x] styles.css
- [x] logo.jpeg
- [x] js/app.js
- [x] js/router.js
- [x] js/config.js
- [x] js/pages/welcome.js
- [x] js/pages/userLogin.js
- [x] js/pages/adminLogin.js
- [x] js/pages/home.js
- [x] js/pages/tracking.js
- [x] js/pages/ticketing.js
- [x] js/pages/dashboard.js
- [x] js/services/api.js
- [x] js/utils/ui.js
- [x] js/utils/map.js
- [x] js/data/mock.js

### Backend Files:
- [x] backend/server.js
- [x] backend/package.json
- [x] backend/.env.example
- [x] backend/config/database.js
- [x] backend/config/blockchain.js
- [x] backend/routes/auth.js
- [x] backend/routes/users.js
- [x] backend/routes/buses.js
- [x] backend/routes/routes.js
- [x] backend/routes/tickets.js
- [x] backend/routes/feedback.js
- [x] backend/routes/analytics.js
- [x] backend/middleware/auth.js
- [x] backend/services/websocket.js
- [x] backend/scripts/setupDatabase.js
- [x] backend/scripts/seed.js

### Documentation Files:
- [x] README.md
- [x] QUICK_START.md
- [x] COMPLETE_SETUP_SUMMARY.md
- [x] DEPLOYMENT_GUIDE.md
- [x] LOGIN_GUIDE.md
- [x] LOGIN_FIX.md
- [x] CURRENT_LOCATION_FIX.md
- [x] FILE_STRUCTURE.md

### Scripts:
- [x] start-all.sh
- [x] stop-all.sh
- [x] backend/start.sh

---

## 🎉 All Files Organized and Documented!

Every file has a clear purpose and location. The project is fully structured and ready for development or deployment! 🚀
