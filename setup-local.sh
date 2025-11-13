#!/bin/bash

echo "🔄 Setting up Real Estate Portal locally with all updates"
echo "=========================================================="

# Get current directory
PROJECT_DIR=$(pwd)

# Step 1: Pull latest changes
echo ""
echo "📥 Step 1: Pulling latest changes from GitHub..."
git fetch origin
git checkout claude/real-estate-portal-complete-011CV3wsLxf76Zb7qCmePaVW
git pull origin claude/real-estate-portal-complete-011CV3wsLxf76Zb7qCmePaVW

echo ""
echo "✅ Latest code pulled successfully!"

# Step 2: Clean and reinstall backend dependencies
echo ""
echo "🔧 Step 2: Setting up Backend..."
cd backend

# Remove old dependencies and cache
echo "   Removing old node_modules and cache..."
rm -rf node_modules package-lock.json

# Install dependencies
echo "   Installing backend dependencies..."
npm install

echo "✅ Backend dependencies installed!"

# Step 3: Set up backend environment
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating backend .env file..."
    cat > .env << 'ENVEOF'
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=real_estate_portal
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Razorpay (Optional - add your keys)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email (Optional - add your credentials)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Agora (Optional - for video calls)
AGORA_APP_ID=your-agora-app-id
AGORA_APP_CERTIFICATE=your-agora-certificate
ENVEOF
    echo "✅ Backend .env created! Please update with your credentials."
else
    echo "✅ Backend .env already exists"
fi

cd ..

# Step 4: Clean and reinstall frontend dependencies
echo ""
echo "⚛️  Step 3: Setting up Frontend..."
cd frontend

# Remove old dependencies, cache, and build
echo "   Removing old node_modules, cache, and build..."
rm -rf node_modules package-lock.json .vite dist

# Install dependencies (including new packages like react-helmet-async)
echo "   Installing frontend dependencies..."
npm install

echo "✅ Frontend dependencies installed!"

# Step 5: Set up frontend environment
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating frontend .env file..."
    cat > .env << 'ENVEOF'
VITE_API_URL=http://localhost:5000
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
VITE_AGORA_APP_ID=your-agora-app-id
ENVEOF
    echo "✅ Frontend .env created! Update if needed."
else
    echo "✅ Frontend .env already exists"
fi

cd ..

# Summary
echo ""
echo "=========================================================="
echo "🎉 Setup Complete!"
echo "=========================================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Start PostgreSQL database (if not running):"
echo "   sudo service postgresql start"
echo "   # Or: pg_ctl -D /usr/local/var/postgres start"
echo ""
echo "2. Start Backend (in new terminal):"
echo "   cd backend"
echo "   npm start"
echo "   # Backend runs on: http://localhost:5000"
echo ""
echo "3. Start Frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo "   # Frontend runs on: http://localhost:5173"
echo ""
echo "4. Open browser and visit:"
echo "   http://localhost:5173"
echo ""
echo "=========================================================="
echo "✨ All Phase 8 features and SEO updates are now available!"
echo "=========================================================="
