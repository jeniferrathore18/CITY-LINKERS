#!/bin/bash

echo "🚀 Starting City Linkers Backend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check PostgreSQL connection
echo "🔍 Checking PostgreSQL connection..."
node -e "import('./config/database.js').then(db => db.query('SELECT NOW()').then(() => console.log('✅ Database connected')).catch(e => { console.error('❌ Database error:', e.message); process.exit(1); }))"

# Check if database is setup
echo "🔍 Checking database tables..."
node -e "import('./config/database.js').then(db => db.query('SELECT COUNT(*) FROM users').then(() => console.log('✅ Database tables exist')).catch(() => { console.log('⚠️  Running database setup...'); import('./scripts/setupDatabase.js'); }))"

echo "✅ Starting server..."
npm run dev
