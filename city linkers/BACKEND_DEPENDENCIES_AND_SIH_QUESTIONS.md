# Backend Dependencies & SIH Questionnaire

## 📦 Backend Dependencies (Actual Installed Versions)

### Core Framework
- **Node.js**: v20.19.5
- **Express.js**: 4.21.2
  - Fast, unopinionated web framework for Node.js
  - Used for building RESTful APIs

### Database
- **PostgreSQL**: 14.19
- **pg (node-postgres)**: 8.16.3
  - PostgreSQL client for Node.js
  - Handles database connections and queries

### Security & Authentication
- **bcrypt**: 5.1.1
  - Password hashing library
  - Secure password storage with salt rounds
- **jsonwebtoken (JWT)**: 9.0.2
  - Token-based authentication
  - Stateless session management
- **helmet**: 7.2.0
  - Security middleware for Express
  - Sets various HTTP headers for protection
- **express-rate-limit**: 7.5.1
  - Rate limiting middleware
  - Prevents brute-force attacks

### Environment & Configuration
- **dotenv**: 16.6.1
  - Loads environment variables from .env file
  - Configuration management

### Middleware & Utilities
- **cors**: 2.8.5
  - Cross-Origin Resource Sharing
  - Enables frontend-backend communication
- **morgan**: 1.10.1
  - HTTP request logger
  - Development and debugging tool

### Real-time Communication
- **ws (WebSocket)**: 8.18.3
  - WebSocket server implementation
  - Real-time bus location updates
  - Live notifications

### Blockchain Integration
- **ethers.js**: 6.15.0
  - Ethereum blockchain library
  - Smart contract interaction
  - Wallet management

### Development Tools
- **nodemon**: 3.1.10 (dev dependency)
  - Auto-restart server on file changes
  - Development productivity tool

---

## 🎯 SIH (Smart India Hackathon) Questionnaire - Backend Topics

### 1. Architecture & Design Questions

#### Q1: System Architecture
**Question**: Explain the overall architecture of your City Linkers backend system. How do different components interact with each other?

**Answer Points**:
- RESTful API architecture using Express.js
- PostgreSQL database for persistent storage
- WebSocket server for real-time updates
- JWT-based authentication system
- Modular route structure (auth, users, buses, routes, tickets, feedback, analytics)
- Middleware pipeline (CORS, Helmet, Rate Limiting, Morgan)

#### Q2: Database Design
**Question**: Describe your database schema and the relationships between different entities.

**Answer Points**:
- **Users table**: Authentication and user profiles (id, name, email, phone, password_hash, role)
- **Buses table**: Fleet management with GPS coordinates (id, route_id, capacity, current_occupancy, latitude, longitude, speed, status)
- **Routes table**: Transit routes with fare structure (id, name, description, fare_base, fare_per_stop, active)
- **Tickets table**: E-ticket purchases and validation (id, user_id, route_id, bus_id, fare_paid, purchase_time, status)
- **Feedback table**: User ratings and comments (id, user_id, bus_id, rating, comment, created_at)
- Relationships: One-to-Many (routes→buses, users→tickets, buses→feedback)

#### Q3: Scalability
**Question**: How would you scale this system to handle 10,000+ concurrent users?

**Answer Points**:
- Horizontal scaling with load balancers (Nginx, HAProxy)
- Database connection pooling (pg pool configuration)
- Redis caching for frequently accessed data
- WebSocket clustering with Redis pub/sub
- CDN for static assets (CloudFlare, AWS CloudFront)
- Database read replicas for query distribution
- Microservices architecture for different modules
- Container orchestration (Kubernetes)

---

### 2. Security Questions

#### Q4: Authentication & Authorization
**Question**: How do you ensure secure user authentication and authorization?

**Answer Points**:
- JWT (JSON Web Tokens) for stateless authentication
- Bcrypt for password hashing (10 salt rounds)
- Token expiration (7 days configurable)
- Role-based access control (user, driver, admin)
- Secure HTTP headers with Helmet middleware
- HTTPS in production (TLS/SSL certificates)
- Password strength validation

#### Q5: API Security
**Question**: What security measures have you implemented to protect your APIs?

**Answer Points**:
- Rate limiting (100 requests per 15 minutes per IP)
- CORS configuration for trusted origins only
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection via Helmet
- Environment variables for sensitive data (.env file)
- Error handling without exposing stack traces in production

#### Q6: Data Privacy
**Question**: How do you handle sensitive user data and ensure GDPR compliance?

**Answer Points**:
- Password hashing (never storing plain text)
- Minimal data collection principle
- User consent mechanisms
- Data encryption at rest and in transit
- Right to deletion implementation
- Audit logs for data access

---

### 3. Real-time Features Questions

#### Q7: WebSocket Implementation
**Question**: Explain how you implemented real-time bus tracking using WebSockets.

**Answer Points**:
- WebSocket server using 'ws' library (v8.18.3)
- Persistent bidirectional connections for live updates
- Broadcasting bus location updates to all connected clients
- Automatic reconnection on disconnect (client-side)
- Message format: JSON with event types (busUpdate, locationChange)
- Connection authentication using JWT
- Heartbeat/ping-pong for connection health

#### Q8: GPS Data Management
**Question**: How do you handle and process GPS data from buses?

**Answer Points**:
- RESTful endpoint `/api/buses/:id/location` for updates
- Database storage with timestamps for historical tracking
- WebSocket broadcast to connected clients immediately
- Data validation (latitude: -90 to 90, longitude: -180 to 180)
- Historical tracking for analytics and route optimization
- Geospatial queries for nearby buses
- Speed calculation from consecutive GPS points

---

### 4. Database & Performance Questions

#### Q9: Database Optimization
**Question**: What database optimization techniques have you used?

**Answer Points**:
- Indexing on frequently queried columns (user_id, bus_id, route_id)
- Connection pooling to reduce overhead (pg pool)
- Prepared statements for query performance
- Efficient JOIN operations (avoiding N+1 queries)
- Pagination for large datasets
- Database normalization (3NF)
- Query optimization with EXPLAIN ANALYZE

#### Q10: API Performance
**Question**: How do you ensure your APIs respond quickly under load?

**Answer Points**:
- Asynchronous operations (async/await pattern)
- Database connection pooling
- Efficient SQL queries with proper indexing
- Caching strategies (future: Redis for session/data)
- Response compression (gzip)
- Monitoring with Morgan logs
- Load testing and optimization

---

### 5. Integration Questions

#### Q11: Blockchain Integration
**Question**: How have you integrated blockchain technology, and what are its benefits?

**Answer Points**:
- Ethers.js library (v6.15.0) for Ethereum interaction
- Smart contracts for ticket validation and fare collection
- Immutable transaction records for audit trail
- Transparent fare collection system
- Decentralized trust mechanism
- Future: NFT-based tickets for unique identification

#### Q12: Third-party Integrations
**Question**: What third-party services or APIs would you integrate for production?

**Answer Points**:
- **Payment gateways**: Razorpay, Stripe, PayTM
- **SMS/Email services**: Twilio, SendGrid, AWS SES
- **Maps API**: Google Maps, Mapbox, OpenStreetMap
- **Push notifications**: Firebase Cloud Messaging (FCM)
- **Analytics**: Google Analytics, Mixpanel
- **Cloud storage**: AWS S3, Cloudinary
- **Monitoring**: Sentry for error tracking

---

### 6. Testing & Quality Questions

#### Q13: Testing Strategy
**Question**: What testing approaches would you implement for this backend?

**Answer Points**:
- **Unit tests**: Individual functions (Jest, Mocha)
- **Integration tests**: API endpoints (Supertest)
- **Database transaction tests**: Rollback scenarios
- **Load testing**: Apache JMeter, Artillery
- **Security testing**: OWASP ZAP, penetration testing
- **Automated CI/CD testing**: GitHub Actions
- **Code coverage**: Istanbul/NYC (target: 80%+)

#### Q14: Error Handling
**Question**: How do you handle errors and ensure system reliability?

**Answer Points**:
- Try-catch blocks for async operations
- Centralized error handling middleware
- Appropriate HTTP status codes (400, 401, 403, 404, 500)
- Detailed logging with Morgan
- Graceful degradation (fallback mechanisms)
- Database transaction rollbacks on errors
- User-friendly error messages

---

### 7. Deployment & DevOps Questions

#### Q15: Deployment Strategy
**Question**: How would you deploy this application to production?

**Answer Points**:
- **Docker containerization**: Dockerfile for backend
- **Cloud platforms**: AWS (EC2, RDS), Azure, GCP
- **Environment-based configuration**: .env files
- **Database migrations**: Automated schema updates
- **CI/CD pipelines**: GitHub Actions, Jenkins, GitLab CI
- **Blue-green deployment**: Zero-downtime updates
- **Health check endpoints**: `/health` for monitoring
- **Auto-scaling**: Based on CPU/memory metrics

#### Q16: Monitoring & Logging
**Question**: How do you monitor the application in production?

**Answer Points**:
- **Morgan** for HTTP request logging
- **Application logs**: Winston, Bunyan for structured logging
- **Error tracking**: Sentry, Rollbar for real-time alerts
- **Performance monitoring**: New Relic, Datadog, PM2
- **Database query monitoring**: pg-monitor
- **Uptime monitoring**: Pingdom, UptimeRobot
- **Alert systems**: PagerDuty for critical failures
- **Metrics dashboard**: Grafana, Prometheus

---

### 8. Advanced Technical Questions

#### Q17: Microservices Architecture
**Question**: How would you break this monolithic backend into microservices?

**Answer Points**:
- **Auth Service**: User authentication and authorization
- **Bus Service**: Fleet management and GPS tracking
- **Ticket Service**: E-ticket purchase and validation
- **Route Service**: Route and stop management
- **Analytics Service**: Data processing and insights
- **Notification Service**: Real-time alerts (SMS, Email, Push)
- **API Gateway**: Kong, AWS API Gateway for routing
- **Service mesh**: Istio for inter-service communication

#### Q18: Caching Strategy
**Question**: What caching strategies would you implement to improve performance?

**Answer Points**:
- **Redis** for session storage and data caching
- Cache frequently accessed routes/buses data
- **Cache-aside pattern**: Check cache first, then database
- **TTL (Time To Live)**: 5-15 minutes for dynamic data
- Cache invalidation on data updates
- **CDN** for static content (images, CSS, JS)
- Database query result caching

#### Q19: Concurrency Handling
**Question**: How do you handle concurrent requests and race conditions?

**Answer Points**:
- Database transactions with ACID properties
- **Optimistic locking**: Version numbers for updates
- **Row-level locking**: FOR UPDATE in critical operations
- Queue systems for async processing (Bull, BeeQueue)
- **Idempotent API design**: Same request = same result
- Request deduplication using unique IDs
- Connection pooling limits to prevent overload

#### Q20: API Versioning
**Question**: How would you implement API versioning for backward compatibility?

**Answer Points**:
- **URL versioning**: `/api/v1/`, `/api/v2/`
- Header-based versioning: `Accept: application/vnd.api+json; version=1`
- Deprecation notices in response headers
- Documentation for each version (Swagger/OpenAPI)
- Gradual migration strategy (6-12 months overlap)
- Support timeline for old versions

---

## 🔍 Technical Deep-Dive Questions

### Q21: JWT Token Management
**Question**: Explain your JWT implementation and token refresh strategy.

**Answer Points**:
- Token generation with user payload (id, email, role)
- Secret key from environment variables (JWT_SECRET)
- Token expiration (7 days configurable)
- Middleware for token verification on protected routes
- Future: Refresh token mechanism (access + refresh tokens)
- Token blacklisting for logout (Redis store)

### Q22: SQL Injection Prevention
**Question**: How do you prevent SQL injection attacks?

**Answer Points**:
- **Parameterized queries** with pg library ($1, $2 placeholders)
- Input validation and sanitization
- ORM usage (future: Sequelize, TypeORM)
- Least privilege database user (limited permissions)
- Prepared statements for repeated queries
- Never concatenating user input into queries

### Q23: Rate Limiting Strategy
**Question**: Explain your rate limiting implementation and its benefits.

**Answer Points**:
- **express-rate-limit** middleware (v7.5.1)
- 100 requests per 15 minutes per IP address
- Prevents brute-force attacks on login endpoints
- DDoS protection at application layer
- Configurable limits per endpoint (stricter for auth)
- Redis-based distributed rate limiting (future)

### Q24: Database Connection Pooling
**Question**: How does connection pooling improve performance?

**Answer Points**:
- Reuses existing database connections
- Reduces connection overhead (handshake, authentication)
- Configurable pool size (max: 20 connections)
- Automatic connection management and recycling
- Handles connection failures gracefully
- Improves concurrent request handling

### Q25: Environment Configuration
**Question**: How do you manage different environments (dev, staging, production)?

**Answer Points**:
- `.env` files for each environment (.env.dev, .env.prod)
- Environment-specific configurations (DB, ports, URLs)
- Secrets management (AWS Secrets Manager, HashiCorp Vault)
- Different database instances per environment
- Feature flags for gradual rollout
- Never commit .env files to version control

---

## 📊 Project-Specific Questions

### Q26: Why PostgreSQL over MongoDB?
**Answer Points**:
- **ACID compliance** for financial transactions (tickets, payments)
- Strong relational data (routes ↔ buses ↔ tickets)
- Complex queries with JOINs and aggregations
- Data integrity constraints (foreign keys, unique)
- Mature ecosystem and tooling
- Better for structured, transactional data
- PostGIS extension for geospatial queries

### Q27: Why Express.js?
**Answer Points**:
- Lightweight and flexible framework
- Large ecosystem of middleware (1000+ packages)
- Easy to learn and implement
- Perfect for RESTful APIs
- Strong community support
- Performance and scalability
- Unopinionated (freedom in architecture)

### Q28: Real-world Challenges
**Question**: What challenges did you face during development?

**Answer Points**:
- **Port conflicts**: macOS ControlCenter using port 5000 (solved: moved to 5001)
- Real-time data synchronization with WebSockets
- Database schema design for optimal performance
- Authentication flow and JWT implementation
- WebSocket connection management and reconnection
- Cross-origin resource sharing (CORS) configuration
- PostgreSQL installation and setup

### Q29: Future Enhancements
**Question**: What features would you add next?

**Answer Points**:
- **Payment gateway integration**: Razorpay, Stripe
- SMS/Email notifications for tickets and alerts
- Advanced analytics dashboard with ML insights
- Machine learning for route optimization
- Mobile app backend (React Native, Flutter)
- Multi-language support (i18n)
- Offline mode support with sync
- QR code scanning for ticket validation
- Driver app for real-time updates

### Q30: Social Impact
**Question**: How does this project contribute to smart city initiatives?

**Answer Points**:
- Reduces traffic congestion through better public transport
- Improves public transport efficiency and reliability
- Real-time information for commuters
- Data-driven route planning and optimization
- Environmental benefits (reduced emissions)
- Accessibility for all citizens
- Digital India initiative alignment
- Transparent and accountable fare system
- Promotes use of public transport over private vehicles

---

## 🎓 Demonstration Tips for SIH

1. **Live Demo**: Show real-time bus tracking with WebSocket updates
2. **API Testing**: Use Postman/Thunder Client to demonstrate endpoints
3. **Database Queries**: Show actual data in PostgreSQL
4. **Security Features**: Demonstrate JWT authentication flow
5. **Error Handling**: Show how system handles errors gracefully
6. **Scalability Discussion**: Explain how to scale to production
7. **Code Quality**: Highlight clean code practices and documentation
8. **Performance Metrics**: Show response times and optimization
9. **Social Impact**: Emphasize benefits to citizens and environment
10. **Future Roadmap**: Discuss planned enhancements

---

## 📋 Quick Reference - Dependency Versions

```json
{
  "runtime": {
    "node": "20.19.5",
    "postgresql": "14.19"
  },
  "dependencies": {
    "express": "4.21.2",
    "pg": "8.16.3",
    "bcrypt": "5.1.1",
    "jsonwebtoken": "9.0.2",
    "ethers": "6.15.0",
    "ws": "8.18.3",
    "helmet": "7.2.0",
    "express-rate-limit": "7.5.1",
    "cors": "2.8.5",
    "morgan": "1.10.1",
    "dotenv": "16.6.1"
  },
  "devDependencies": {
    "nodemon": "3.1.10"
  }
}
```

---

**Prepared by**: City Linkers Team  
**Date**: September 30, 2025  
**Technology Stack**: Node.js 20, Express.js 4, PostgreSQL 14, WebSocket, JWT, Blockchain  
**Total Questions**: 30 comprehensive questions with detailed answers