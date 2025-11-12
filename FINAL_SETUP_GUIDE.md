# 🚀 Final Setup Guide - Real Estate Portal

Complete step-by-step guide to get your entire Real Estate Portal (Backend, Frontend, Mobile App) up and running locally and in production.

---

## 📋 Table of Contents

1. [Quick Overview](#quick-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Production Deployment](#production-deployment)
5. [Docker Deployment](#docker-deployment)
6. [CI/CD Setup](#cicd-setup)
7. [Mobile App Setup](#mobile-app-setup)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Overview

**What You Have:**
- ✅ Complete Backend API (Node.js + Express + PostgreSQL)
- ✅ Full Frontend App (React + Vite + Redux)
- ✅ Mobile App (React Native for iOS & Android)
- ✅ Docker Infrastructure
- ✅ GitHub Actions CI/CD
- ✅ Comprehensive Documentation

**What You'll Do:**
1. Test everything locally
2. Deploy to production (Railway + Vercel)
3. Optional: Setup Docker or CI/CD

---

## 📦 Prerequisites

### Required Software

```bash
# Check if you have these installed:
node --version          # Should be v18 or higher
npm --version           # Should be v9 or higher
psql --version          # PostgreSQL 14 or higher
git --version           # Any recent version
```

### Install Missing Software

**Node.js & npm:**
```bash
# Download from: https://nodejs.org/
# Or use nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

**PostgreSQL:**
```bash
# macOS:
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian:
sudo apt-get install postgresql-14

# Windows:
# Download from: https://www.postgresql.org/download/windows/
```

**Git:**
```bash
# macOS:
brew install git

# Ubuntu/Debian:
sudo apt-get install git

# Windows:
# Download from: https://git-scm.com/download/win
```

---

## 💻 Local Development Setup

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd sathish
```

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

**Edit `.env` file:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=realestate_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Razorpay (get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# AWS S3 (optional - for production image uploads)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Server
PORT=5000
NODE_ENV=development
```

**Create Database:**
```bash
# Login to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE realestate_db;
CREATE USER realestate WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE realestate_db TO realestate;
\q

# Run migrations
npx sequelize-cli db:migrate

# Optional: Seed demo data
npx sequelize-cli db:seed:all
```

**Start Backend:**
```bash
npm run dev

# You should see:
# Server running on http://localhost:5000
```

**Test Backend:**
```bash
# In a new terminal:
curl http://localhost:5000/health
# Should return: {"status":"ok"}
```

### Step 3: Setup Frontend

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env
nano .env
```

**Edit `.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

**Start Frontend:**
```bash
npm run dev

# You should see:
# Local: http://localhost:5173
```

**Open in Browser:**
```
http://localhost:5173
```

You should see the Real Estate Portal home page!

### Step 4: Test the Application

1. **Register a New User:**
   - Click "Register"
   - Fill in details
   - Select role (Buyer or Seller)
   - Submit

2. **Login:**
   - Use your credentials
   - You should be redirected to home page

3. **Browse Properties:**
   - Click "Properties" tab
   - Try filters
   - View property details

4. **Post Property (if Seller):**
   - Click "Post New Property" from home
   - Fill in all details
   - Add photos
   - Submit

5. **Book Service:**
   - Click on any service card
   - Fill in booking form
   - Submit

✅ **If everything works, you're ready for production!**

---

## 🌐 Production Deployment

### Option 1: Railway + Vercel (Recommended - Easiest)

#### A. Deploy Backend to Railway

**1. Install Railway CLI:**
```bash
npm install -g @railway/cli
```

**2. Login to Railway:**
```bash
railway login
# This will open browser for authentication
```

**3. Deploy Backend:**
```bash
cd backend

# Initialize Railway project
railway init
# Select "Create new project"
# Name it: "realestate-backend"

# Add PostgreSQL database
railway add
# Select "PostgreSQL"

# Deploy
railway up

# Get your database credentials
railway variables
# Copy DATABASE_URL
```

**4. Set Environment Variables:**

Go to Railway Dashboard → Your Project → Variables and add:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=<generate-random-32-char-string>
RAZORPAY_KEY_ID=rzp_live_your_live_key
RAZORPAY_KEY_SECRET=your_live_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-production-bucket
```

**5. Run Migrations:**
```bash
railway run npm run migrate
```

**6. Note Your Backend URL:**
```
https://your-app.railway.app
```

#### B. Deploy Frontend to Vercel

**1. Install Vercel CLI:**
```bash
npm install -g vercel
```

**2. Deploy Frontend:**
```bash
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**3. Set Environment Variables:**

During deployment or in Vercel Dashboard:
```env
VITE_API_URL=https://your-backend.railway.app/api
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key
```

**4. Redeploy if needed:**
```bash
vercel --prod
```

**5. Note Your Frontend URL:**
```
https://your-app.vercel.app
```

✅ **Your app is now LIVE!**

---

## 🐳 Docker Deployment

### Local Docker Testing

**1. Setup Environment:**
```bash
# In project root
cp .env.docker .env

# Edit .env with your credentials
nano .env
```

**2. Start Everything:**
```bash
docker compose up -d
```

**3. Check Status:**
```bash
docker compose ps
# All services should be "Up"

docker compose logs -f backend
# Check for any errors
```

**4. Access Application:**
- Frontend: http://localhost
- Backend: http://localhost:5000
- Database: localhost:5432

**5. Stop Everything:**
```bash
docker compose down

# To remove data too:
docker compose down -v
```

### Production Docker Deployment

**On Your VPS/Server:**

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone repository
git clone <your-repo>
cd sathish

# Setup environment
cp .env.docker .env
nano .env  # Add production values

# Start services
docker compose up -d

# Check logs
docker compose logs -f

# Setup auto-restart (systemd)
sudo nano /etc/systemd/system/realestate.service
```

**systemd service file:**
```ini
[Unit]
Description=Real Estate Portal
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/path/to/sathish
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down

[Install]
WantedBy=multi-user.target
```

**Enable auto-start:**
```bash
sudo systemctl enable realestate
sudo systemctl start realestate
```

---

## ⚙️ CI/CD Setup

### GitHub Actions Configuration

**1. Add GitHub Secrets:**

Go to: **Repository → Settings → Secrets and variables → Actions**

**Required Secrets:**

**For Railway:**
```
RAILWAY_TOKEN=<get from Railway dashboard>
RAILWAY_PROJECT_ID=<your project id>
BACKEND_URL=https://your-backend.railway.app
```

**For Vercel:**
```
VERCEL_TOKEN=<get from Vercel settings>
VERCEL_ORG_ID=<from .vercel/project.json>
VERCEL_PROJECT_ID=<from .vercel/project.json>
FRONTEND_URL=https://your-frontend.vercel.app
```

**For Razorpay:**
```
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret
```

**Optional:**
```
SLACK_WEBHOOK_URL=<for notifications>
SNYK_TOKEN=<for security scanning>
```

**2. Get Railway Token:**
```bash
# In Railway dashboard
# Settings → Tokens → Create Token
```

**3. Get Vercel Credentials:**
```bash
cd frontend
vercel link
cat .vercel/project.json
# Copy orgId and projectId
```

**4. Enable Workflows:**

The workflows are already created in `.github/workflows/`. They will run automatically on:

- Push to main/develop branches
- Pull requests
- Manual trigger

**5. Test CI/CD:**
```bash
# Make a small change
echo "# Test" >> README.md
git add README.md
git commit -m "test: trigger CI/CD [deploy]"
git push origin main

# Watch in: GitHub → Actions tab
```

---

## 📱 Mobile App Setup

### Prerequisites

**For Android:**
- Android Studio
- JDK 11+
- Android SDK

**For iOS (macOS only):**
- Xcode 14+
- CocoaPods

### Setup Instructions

**1. Install Dependencies:**
```bash
cd mobile
npm install

# iOS only:
cd ios
pod install
cd ..
```

**2. Configure Environment:**
```bash
cp .env.example .env
nano .env
```

**Edit `.env`:**
```env
# For Android Emulator, use 10.0.2.2
# For iOS Simulator, use localhost
API_URL=http://10.0.2.2:5000/api

# Or for production:
# API_URL=https://your-backend.railway.app/api

RAZORPAY_KEY_ID=rzp_test_your_key
```

**3. Run on Android:**
```bash
# Start emulator first, then:
npm run android
```

**4. Run on iOS:**
```bash
npm run ios
```

### Build for Production

**Android APK:**
```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

**Android AAB (for Play Store):**
```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

**iOS:**
1. Open `ios/RealEstateApp.xcworkspace` in Xcode
2. Select "Any iOS Device"
3. Product → Archive
4. Distribute to App Store

---

## 🧪 Testing

### Backend API Testing

**Manual Testing with curl:**
```bash
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test@123","role":"user"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'

# Get properties (with token)
curl http://localhost:5000/api/properties \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Automated Testing:**
```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

### Mobile App Testing

```bash
cd mobile
npm test
```

---

## 🔧 Troubleshooting

### Backend Issues

**Problem: Database connection failed**
```bash
# Check PostgreSQL is running
psql postgres -c "SELECT version();"

# Check credentials
psql -U realestate -d realestate_db

# Reset database
npm run db:reset
```

**Problem: Port 5000 already in use**
```bash
# Find process
lsof -i :5000

# Kill it
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### Frontend Issues

**Problem: API calls failing**
```bash
# Check VITE_API_URL in .env
echo $VITE_API_URL

# Restart dev server
npm run dev
```

**Problem: Build fails**
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Mobile App Issues

**Problem: Android can't connect to backend**
```env
# Use 10.0.2.2 for emulator
API_URL=http://10.0.2.2:5000/api

# Or for real device, use computer's IP
API_URL=http://192.168.1.100:5000/api
```

**Problem: iOS build fails**
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Docker Issues

**Problem: Containers not starting**
```bash
# Check logs
docker compose logs

# Restart specific service
docker compose restart backend

# Rebuild
docker compose up --build
```

**Problem: Out of disk space**
```bash
# Clean up
docker system prune -a
docker volume prune
```

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] API endpoints working
- [ ] Frontend connecting to backend
- [ ] Mobile app connecting to backend

### Production Setup

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Database created and migrated
- [ ] Environment variables set
- [ ] Custom domains configured (optional)
- [ ] SSL certificates active

### Post-Deployment

- [ ] Health check endpoints working
- [ ] User registration working
- [ ] Login working
- [ ] Property listing working
- [ ] Service booking working
- [ ] Payment gateway tested
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics setup (Google Analytics)

### CI/CD Setup

- [ ] GitHub secrets configured
- [ ] Workflows enabled
- [ ] Test deployment successful
- [ ] Rollback procedure tested

---

## 🎯 Quick Reference

### Useful Commands

**Backend:**
```bash
npm run dev         # Start development server
npm run start       # Start production server
npm run migrate     # Run database migrations
npm run seed        # Seed demo data
npm test            # Run tests
```

**Frontend:**
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm test            # Run tests
```

**Mobile:**
```bash
npm run android     # Run on Android
npm run ios         # Run on iOS
npm start           # Start Metro bundler
npm test            # Run tests
```

**Docker:**
```bash
docker compose up -d              # Start all services
docker compose down               # Stop all services
docker compose logs -f backend    # View logs
docker compose restart backend    # Restart service
docker compose ps                 # Check status
```

### Important URLs

**Development:**
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- API Docs: http://localhost:5000/api-docs

**Production:**
- Backend: https://your-backend.railway.app
- Frontend: https://your-frontend.vercel.app

---

## 📚 Additional Resources

- **Backend API Documentation:** See `QUICK_START.md`
- **Testing Guide:** See `TESTING_GUIDE.md`
- **Deployment Guide:** See `DEPLOYMENT_GUIDE.md`
- **Docker Guide:** See `DOCKER_GUIDE.md`
- **CI/CD Guide:** See `CI_CD_GUIDE.md`
- **Mobile App Guide:** See `MOBILE_APP_GUIDE.md`
- **Additional Features:** See `ADDITIONAL_FEATURES.md`

---

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review error logs
3. Check documentation
4. Search GitHub issues
5. Create new issue with:
   - Error message
   - Steps to reproduce
   - Environment details

---

## 🎉 Congratulations!

You now have a fully functional Real Estate Portal with:
- ✅ Backend API with 80+ endpoints
- ✅ React frontend with full functionality
- ✅ React Native mobile app for iOS & Android
- ✅ Production deployment
- ✅ CI/CD pipeline
- ✅ Docker containerization

**Next Steps:**
1. Customize branding and colors
2. Add your actual property data
3. Configure payment gateway with live keys
4. Setup custom domain
5. Launch to users!

**Good luck with your Real Estate Portal!** 🏘️🚀
