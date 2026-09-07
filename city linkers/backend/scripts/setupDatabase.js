import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const setupDatabase = async () => {
  // Connect to PostgreSQL (default database)
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'postgres' // Connect to default database first
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Check if database exists
    const dbName = process.env.DB_NAME || 'city_linkers';
    const checkDB = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkDB.rows.length === 0) {
      // Create database
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully`);
    } else {
      console.log(`ℹ️  Database '${dbName}' already exists`);
    }

    await client.end();

    // Now connect to the new database and create tables
    const appClient = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: dbName
    });

    await appClient.connect();
    console.log(`Connected to database '${dbName}'`);

    // Create tables
    await appClient.query(`
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Routes table
      CREATE TABLE IF NOT EXISTS routes (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        fare_base DECIMAL(10, 2) DEFAULT 20.00,
        fare_per_stop DECIMAL(10, 2) DEFAULT 5.00,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Stops table
      CREATE TABLE IF NOT EXISTS stops (
        id SERIAL PRIMARY KEY,
        route_id VARCHAR(50) REFERENCES routes(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        sequence_order INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Buses table
      CREATE TABLE IF NOT EXISTS buses (
        id VARCHAR(50) PRIMARY KEY,
        route_id VARCHAR(50) REFERENCES routes(id),
        capacity INT DEFAULT 50,
        current_occupancy INT DEFAULT 0,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        speed DECIMAL(5, 2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Tickets table
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        ticket_id VARCHAR(100) UNIQUE NOT NULL,
        user_id INT REFERENCES users(id),
        route_id VARCHAR(50) REFERENCES routes(id),
        from_stop_id INT REFERENCES stops(id),
        to_stop_id INT REFERENCES stops(id),
        passengers INT DEFAULT 1,
        fare DECIMAL(10, 2) NOT NULL,
        blockchain_tx_hash VARCHAR(255),
        blockchain_token_id VARCHAR(100),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Feedback table
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        rating INT CHECK (rating >= 1 AND rating <= 5),
        feedback_text TEXT,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Trip history table
      CREATE TABLE IF NOT EXISTS trip_history (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        route_id VARCHAR(50) REFERENCES routes(id),
        from_stop VARCHAR(255),
        to_stop VARCHAR(255),
        fare DECIMAL(10, 2),
        trip_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
      CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);
      CREATE INDEX IF NOT EXISTS idx_tickets_route ON tickets(route_id);
      CREATE INDEX IF NOT EXISTS idx_buses_route ON buses(route_id);
      CREATE INDEX IF NOT EXISTS idx_stops_route ON stops(route_id);
    `);

    console.log('✅ All tables created successfully');

    await appClient.end();
    console.log('✅ Database setup complete');
  } catch (error) {
    console.error('❌ Database setup error:', error);
    process.exit(1);
  }
};

setupDatabase();
