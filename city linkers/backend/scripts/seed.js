import pool from '../config/database.js';
import bcrypt from 'bcrypt';

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Seed users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    await pool.query(`
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES 
        ('John Doe', 'john@example.com', '+919876543211', $1, 'user'),
        ('Jane Smith', 'jane@example.com', '+919876543212', $1, 'user'),
        ('Admin User', 'admin@citylinkers.com', '+919876543210', $2, 'admin')
      ON CONFLICT (email) DO NOTHING;
    `, [hashedPassword, adminPassword]);

    // Seed routes
    await pool.query(`
      INSERT INTO routes (id, name, description, fare_base, fare_per_stop)
      VALUES 
        ('R1', 'Red Loop', 'Downtown to Tech Park via Central Station', 20.00, 5.00),
        ('R2', 'Green Loop', 'University to Airport via Mall', 20.00, 5.00),
        ('R3', 'Blue Express', 'North Hub to South Terminal express route', 25.00, 7.00)
      ON CONFLICT (id) DO NOTHING;
    `);

    // Seed stops for R1
    await pool.query(`
      INSERT INTO stops (route_id, name, latitude, longitude, sequence_order)
      VALUES 
        ('R1', 'Downtown Station', 28.6139, 77.2090, 1),
        ('R1', 'Central Market', 28.6200, 77.2150, 2),
        ('R1', 'Tech Park', 28.6300, 77.2250, 3),
        ('R1', 'University', 28.6400, 77.2350, 4)
      ON CONFLICT DO NOTHING;
    `);

    // Seed stops for R2
    await pool.query(`
      INSERT INTO stops (route_id, name, latitude, longitude, sequence_order)
      VALUES 
        ('R2', 'North Hub', 28.7000, 77.1000, 1),
        ('R2', 'Garden Plaza', 28.7100, 77.1100, 2),
        ('R2', 'Market Square', 28.7200, 77.1200, 3),
        ('R2', 'Airport', 28.7300, 77.1300, 4)
      ON CONFLICT DO NOTHING;
    `);

    // Seed buses
    await pool.query(`
      INSERT INTO buses (id, route_id, capacity, current_occupancy, latitude, longitude, speed, status)
      VALUES 
        ('Bus101', 'R1', 50, 15, 28.6139, 77.2090, 35.5, 'active'),
        ('Bus102', 'R1', 50, 28, 28.6200, 77.2150, 40.2, 'active'),
        ('Bus201', 'R2', 45, 12, 28.7000, 77.1000, 30.0, 'active'),
        ('Bus202', 'R2', 45, 35, 28.7100, 77.1100, 25.5, 'active'),
        ('Bus301', 'R3', 60, 45, 28.6500, 77.2500, 50.0, 'active')
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
