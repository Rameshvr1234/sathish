# 🚀 How to Run the Real Estate Portal Application

A complete step-by-step guide to get the application running on your local machine.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before starting, ensure you have the following installed:

### Required Software

1. **Node.js** (v18.x or higher)
   ```bash
   node --version
   ```
   Download from: https://nodejs.org/

2. **npm** (v9.x or higher)
   ```bash
   npm --version
   ```

3. **Git**
   ```bash
   git --version
   ```

4. **PostgreSQL** (v12 or higher) OR **Docker**
   - PostgreSQL: https://www.postgresql.org/download/
   - Docker: https://www.docker.com/get-started

5. **Text Editor/IDE** (VS Code, Sublime, etc.)

---

## 🔧 Initial Setup

### Step 1: Clone/Download the Repository

If not already done:

```bash
# If cloning
git clone <repository-url>
cd sathish

# If already downloaded
cd /path/to/sathish
```

### Step 2: Verify Project Structure

Check that you have these folders:

```bash
ls -la
```

You should see:
- `backend/` - Node.js/Express backend
- `frontend/` - React/Vite frontend
- `mobile/` - React Native mobile app (optional)

---

## 🗄️ Database Setup

Choose one of the following options:

### Option A: Using Docker (Recommended - Easiest)

**Step 1:** Start PostgreSQL container

```bash
docker run -d \
  --name real-estate-db \
  -e POSTGRES_DB=real_estate_portal \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

**Step 2:** Verify container is running

```bash
docker ps
```

You should see `real-estate-db` in the list.

**Step 3:** Test connection

```bash
docker exec -it real-estate-db psql -U postgres -d real_estate_portal
```

Type `\q` to exit.

---

### Option B: Using Installed PostgreSQL

#### On Ubuntu/Debian:

**Step 1:** Install PostgreSQL

```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

**Step 2:** Start PostgreSQL service

```bash
sudo service postgresql start
```

**Step 3:** Create database

```bash
# Access PostgreSQL
sudo -u postgres psql

# In PostgreSQL prompt, run:
CREATE DATABASE real_estate_portal;
CREATE USER real_estate_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE real_estate_portal TO real_estate_user;
\q
```

#### On macOS (with Homebrew):

**Step 1:** Install PostgreSQL

```bash
brew install postgresql@15
```

**Step 2:** Start PostgreSQL

```bash
brew services start postgresql@15
```

**Step 3:** Create database

```bash
psql postgres

# In PostgreSQL prompt:
CREATE DATABASE real_estate_portal;
\q
```

#### On Windows:

1. Download installer from: https://www.postgresql.org/download/windows/
2. Run installer and follow setup wizard
3. Use pgAdmin or command line to create database `real_estate_portal`

---

## 🔨 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express
- Sequelize
- Socket.io
- JWT authentication
- And more...

**Wait for installation to complete** (may take 1-2 minutes)

### Step 3: Create Environment File

Create a file named `.env` in the `backend/` directory:

```bash
touch .env
```

Or use your text editor to create it.

### Step 4: Configure Environment Variables

Open `backend/.env` and add the following:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database Configuration (for Docker)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=real_estate_portal
DB_USER=postgres
DB_PASSWORD=postgres

# Database Configuration (for installed PostgreSQL)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=real_estate_portal
# DB_USER=real_estate_user
# DB_PASSWORD=your_secure_password

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: Payment Integration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Optional: Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional: File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

**Important Notes:**
- Use the Docker credentials if you chose Option A
- Use your custom credentials if you chose Option B
- Change `JWT_SECRET` to a random string
- Payment and email are optional for initial setup

### Step 5: Verify Backend Structure

```bash
# From backend directory
ls -la
```

You should see:
- `server.js` - Main server file
- `models/` - Database models
- `routes/` - API routes
- `controllers/` - Business logic
- `middleware/` - Auth & validation
- `package.json` - Dependencies
- `.env` - Your configuration file

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd ../frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React
- Vite
- React Router
- Axios
- Material-UI/Tailwind
- SEO packages
- And more...

**Wait for installation to complete** (may take 1-2 minutes)

### Step 3: Create Environment File

Create a file named `.env` in the `frontend/` directory:

```bash
touch .env
```

### Step 4: Configure Environment Variables

Open `frontend/.env` and add:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Optional: Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Razorpay (for payments)
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id

# Optional: Google Maps
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

**Important Notes:**
- `VITE_API_URL` must match your backend URL
- Analytics and Maps are optional for initial setup

### Step 5: Verify Frontend Structure

```bash
# From frontend directory
ls -la
```

You should see:
- `src/` - Source code
- `public/` - Static files
- `index.html` - Entry HTML
- `vite.config.js` - Vite configuration
- `package.json` - Dependencies
- `.env` - Your configuration file

---

## 🎬 Running the Application

You'll need **TWO terminal windows/tabs** open.

### Terminal 1: Start Backend Server

**Step 1:** Navigate to backend

```bash
cd /path/to/sathish/backend
```

**Step 2:** Start the server

```bash
npm start
```

**Expected Output:**

```
Server running on port 5000
Connecting to database...
✓ Database connected successfully
✓ All models synced
✓ Server is ready to accept requests
```

**Keep this terminal running!**

### Terminal 2: Start Frontend Development Server

**Step 1:** Open a new terminal and navigate to frontend

```bash
cd /path/to/sathish/frontend
```

**Step 2:** Start the development server

```bash
npm run dev
```

**Expected Output:**

```
VITE v4.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Keep this terminal running!**

---

## ✅ Verification

### Step 1: Open Browser

Navigate to: **http://localhost:5173**

You should see the Real Estate Portal homepage.

### Step 2: Test Backend API

Open a third terminal and run:

```bash
# Test health endpoint
curl http://localhost:5000/health
```

**Expected Response:**
```json
{"status":"OK","timestamp":"2025-11-17T..."}
```

```bash
# Test API endpoints
curl http://localhost:5000/api/properties
curl http://localhost:5000/api/seo/sitemap.xml
curl http://localhost:5000/api/seo/robots.txt
```

### Step 3: Check Browser Console

1. Open browser Developer Tools (F12 or Right-click → Inspect)
2. Go to **Console** tab
3. You should see:
   - ✅ No red errors
   - ✅ Successful API calls to `http://localhost:5000`

### Step 4: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Refresh the page
3. You should see API calls being made successfully

### Step 5: Test Features

Try the following:

#### Homepage
- View property listings
- Use search filters
- Navigate between pages

#### User Registration
- Click "Sign Up"
- Create a test account
- Verify email (if configured)

#### Property Search
- Search by location
- Filter by price range
- Filter by property type

#### SEO Features
- Right-click → "View Page Source"
- Look for meta tags:
  ```html
  <meta property="og:title" content="...">
  <meta name="description" content="...">
  <script type="application/ld+json">...</script>
  ```

#### Advanced Features (Phase 8)
- Virtual Tours: http://localhost:5173/virtual-tours
- AI Recommendations: http://localhost:5173/ai-recommendations
- Home Loans: http://localhost:5173/home-loans
- Analytics Dashboard: http://localhost:5173/analytics

---

## 🎉 Success!

If you see the application running without errors, congratulations! You've successfully set up the Real Estate Portal.

### What's Running:

- ✅ **Backend API**: http://localhost:5000
- ✅ **Frontend App**: http://localhost:5173
- ✅ **PostgreSQL Database**: localhost:5432
- ✅ **All Features Available**

### Next Steps:

1. **Create Test Data**: Register users and add properties
2. **Explore Features**: Test all Phase 8 and SEO features
3. **Development**: Start building new features
4. **Testing**: Run tests (see TESTING_GUIDE.md)
5. **Deployment**: Deploy to production (see DEPLOYMENT_GUIDE.md)

---

## 🐛 Troubleshooting

### Issue 1: "Cannot connect to database"

**Symptoms:**
```
Error: Connection refused
Database connection failed
```

**Solution:**

```bash
# Check if PostgreSQL is running
sudo service postgresql status
# Or for Docker:
docker ps | grep real-estate-db

# If not running, start it
sudo service postgresql start
# Or for Docker:
docker start real-estate-db

# Test connection
psql -h localhost -U postgres -d real_estate_portal
# Or for Docker:
docker exec -it real-estate-db psql -U postgres -d real_estate_portal
```

---

### Issue 2: "Port 5000 already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

```bash
# Find process using port 5000
lsof -i :5000
# Or:
netstat -ano | grep 5000

# Kill the process
kill -9 <PID>

# Or change the port in backend/.env
PORT=5001
```

---

### Issue 3: "Module not found"

**Symptoms:**
```
Error: Cannot find module 'express'
Error: Cannot find module 'react-helmet-async'
```

**Solution:**

```bash
# Reinstall backend dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

# Reinstall frontend dependencies
cd ../frontend
rm -rf node_modules package-lock.json .vite
npm install
```

---

### Issue 4: "CORS errors in browser"

**Symptoms:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**

Check `backend/.env` has:
```env
FRONTEND_URL=http://localhost:5173
```

Restart backend server after changing.

---

### Issue 5: "Blank page in browser"

**Symptoms:**
- Browser shows blank white page
- No errors in console

**Solution:**

```bash
# Clear Vite cache and rebuild
cd frontend
rm -rf .vite dist node_modules
npm install
npm run dev

# Also check browser console for errors
# Make sure backend is running
```

---

### Issue 6: "Database sync errors"

**Symptoms:**
```
Error: relation "users" does not exist
Sequelize sync error
```

**Solution:**

```bash
# Drop and recreate database
sudo -u postgres psql

# In PostgreSQL:
DROP DATABASE IF EXISTS real_estate_portal;
CREATE DATABASE real_estate_portal;
\q

# Restart backend - it will recreate tables
cd backend
npm start
```

---

### Issue 7: "Frontend can't connect to backend"

**Symptoms:**
- API calls fail
- Network errors in console

**Solution:**

1. **Check backend is running:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Check frontend .env:**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. **Restart frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

---

### Issue 8: "npm install fails"

**Symptoms:**
```
npm ERR! code EACCES
npm ERR! permission denied
```

**Solution:**

```bash
# Fix npm permissions
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER .

# Or run with sudo (not recommended)
sudo npm install
```

---

### Issue 9: "Node version incompatible"

**Symptoms:**
```
error: This version of Node.js requires...
```

**Solution:**

```bash
# Check Node version
node --version

# If below 18.x, update Node.js
# Using nvm (recommended):
nvm install 18
nvm use 18

# Or download from nodejs.org
```

---

### Issue 10: "JWT token errors"

**Symptoms:**
```
JsonWebTokenError: invalid token
Token verification failed
```

**Solution:**

1. **Clear browser localStorage:**
   ```javascript
   // In browser console
   localStorage.clear()
   ```

2. **Check JWT_SECRET in backend/.env:**
   ```env
   JWT_SECRET=your-super-secret-jwt-key
   ```

3. **Restart backend server**

---

## 🔄 Starting Fresh (Nuclear Option)

If nothing works, start completely fresh:

```bash
# 1. Stop all running processes
# Press Ctrl+C in both terminal windows

# 2. Stop and remove database (if using Docker)
docker stop real-estate-db
docker rm real-estate-db

# 3. Delete all generated files
cd /path/to/sathish
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json frontend/.vite frontend/dist

# 4. Pull latest code (if using git)
git fetch origin
git pull origin claude/real-estate-portal-complete-011CV3wsLxf76Zb7qCmePaVW

# 5. Start fresh database (Docker)
docker run -d \
  --name real-estate-db \
  -e POSTGRES_DB=real_estate_portal \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# 6. Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 7. Create .env files (as described above)

# 8. Start servers
# Terminal 1: cd backend && npm start
# Terminal 2: cd frontend && npm run dev
```

---

## 📞 Getting Help

If you're still experiencing issues:

### Provide the Following Information:

1. **Operating System**: (Windows, macOS, Linux)
2. **Node.js Version**: `node --version`
3. **npm Version**: `npm --version`
4. **Database**: (PostgreSQL installed or Docker)
5. **Error Messages**: Full error from terminal
6. **Browser Console Errors**: Screenshots or text
7. **Which Step Failed**: Specific step number

### Check Logs:

**Backend logs:**
```bash
cd backend
npm start 2>&1 | tee backend.log
# Check backend.log file
```

**Frontend logs:**
```bash
cd frontend
npm run dev 2>&1 | tee frontend.log
# Check frontend.log file
```

---

## 📚 Additional Resources

- **Testing Guide**: See `TESTING_GUIDE.md`
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **API Documentation**: http://localhost:5000/api-docs (when running)
- **Feature Documentation**: See `PHASE_8_FEATURES.md`
- **SEO Features**: See `SEO_IMPLEMENTATION.md`

---

## 🎯 Quick Reference

### Start Application (After Initial Setup)

```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev

# Browser
# Open http://localhost:5173
```

### Stop Application

```bash
# Press Ctrl+C in both terminals
```

### Restart Application

```bash
# Just press Ctrl+C and run start commands again
```

---

## ✨ Features Available

Once running, you have access to:

### Core Features
- ✅ User Authentication (Register/Login)
- ✅ Property Listings & Search
- ✅ Advanced Filters
- ✅ Property Details & Images
- ✅ Favorites/Wishlist
- ✅ User Dashboard

### Phase 8 Features
- ✅ 360° Virtual Tours
- ✅ AI-Powered Property Recommendations
- ✅ Home Loan Calculator & Application
- ✅ Video Call Tour Booking
- ✅ Advanced Analytics Dashboard
- ✅ Real-time Notifications

### SEO Features
- ✅ Dynamic Meta Tags
- ✅ XML Sitemap (`/api/seo/sitemap.xml`)
- ✅ Robots.txt (`/api/seo/robots.txt`)
- ✅ Schema.org Structured Data
- ✅ Open Graph & Twitter Cards
- ✅ Google Analytics Integration

### Admin Features
- ✅ Property Management
- ✅ User Management
- ✅ Analytics & Reports
- ✅ Content Management

---

**Made with ❤️ for Real Estate Portal**

**Version**: 1.0.0
**Last Updated**: November 2025

---

**Happy Coding! 🚀**
