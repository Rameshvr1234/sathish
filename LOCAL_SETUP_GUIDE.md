# Local Setup Guide - Get All Updates Working

## 🔍 Problem: Frontend Not Showing Updates

If you've downloaded the code locally but don't see the new features (Phase 8, SEO, etc.), follow this guide.

---

## 🚀 Quick Fix (Automated)

Run this single command to fix everything:

```bash
./setup-local.sh
```

This will:
- ✅ Pull latest code
- ✅ Clean and reinstall backend dependencies
- ✅ Clean and reinstall frontend dependencies (including new packages)
- ✅ Create .env files
- ✅ Clear all caches

Then start the application (see instructions at the end).

---

## 🔧 Manual Fix (Step by Step)

If you prefer to do it manually:

### Step 1: Make Sure You Have Latest Code

```bash
# Check current branch
git branch

# Should show: * claude/real-estate-portal-complete-011CV3wsLxf76Zb7qCmePaVW

# Pull latest changes
git fetch origin
git pull origin claude/real-estate-portal-complete-011CV3wsLxf76Zb7qCmePaVW
```

### Step 2: Reinstall Backend Dependencies

```bash
cd backend

# Remove old files
rm -rf node_modules package-lock.json

# Fresh install
npm install

# Create .env if doesn't exist
cp .env.example .env  # Or create manually
```

**Backend .env file:**
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=real_estate_portal
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your-super-secret-jwt-key-change-this

# Optional: Add your API keys
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
```

### Step 3: Reinstall Frontend Dependencies (IMPORTANT!)

```bash
cd ../frontend

# Remove everything - old node_modules, cache, builds
rm -rf node_modules package-lock.json .vite dist

# Fresh install (this installs NEW packages like react-helmet-async)
npm install

# Create .env if doesn't exist
```

**Frontend .env file:**
```env
VITE_API_URL=http://localhost:5000
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_RAZORPAY_KEY_ID=your-razorpay-key
```

**Why this is important:**
The frontend has new dependencies added:
- `react-helmet-async` (for SEO)
- `prop-types` (for component validation)

If you don't reinstall, these packages won't be available!

### Step 4: Verify New Files Exist

Check that you have these new files:

**Backend:**
```bash
ls backend/routes/seoRoutes.js
ls backend/routes/virtualTourRoutes.js
ls backend/routes/aiRecommendationRoutes.js
ls backend/routes/homeLoanRoutes.js
ls backend/models/VirtualTour.js
ls backend/models/AIRecommendation.js
```

**Frontend:**
```bash
ls frontend/src/components/SEO/SEOHead.jsx
ls frontend/src/components/SEO/PropertySEO.jsx
ls frontend/src/utils/seo.js
ls frontend/src/pages/VirtualTourViewer.jsx
ls frontend/src/components/AIRecommendations.jsx
```

If any are missing, you don't have the latest code - go back to Step 1.

---

## 🗄️ Database Setup

### Option 1: PostgreSQL (Recommended for Full Features)

**Install PostgreSQL:**

Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

Mac (with Homebrew):
```bash
brew install postgresql
brew services start postgresql
```

**Create Database:**
```bash
# Access PostgreSQL
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE real_estate_portal;
CREATE USER real_estate_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE real_estate_portal TO real_estate_user;
\q
```

**Update backend/.env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=real_estate_portal
DB_USER=real_estate_user
DB_PASSWORD=your_password
```

### Option 2: Use Docker (Easiest)

If you have Docker installed:

```bash
# Start PostgreSQL in Docker
docker run -d \
  --name real-estate-db \
  -e POSTGRES_DB=real_estate_portal \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Check it's running
docker ps
```

### Option 3: Skip Database (Limited Testing)

You can start without database, but some features won't work:
- User registration/login
- Property listings
- All Phase 8 features

---

## 🚀 Start the Application

### Terminal 1 - Backend:

```bash
cd backend
npm start
```

**You should see:**
```
Server running on port 5000
Database connected successfully
```

**Test it:** Visit http://localhost:5000/health
Should return: `{"status":"OK"}`

### Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

**You should see:**
```
VITE v4.x.x ready in xxx ms

➜ Local: http://localhost:5173/
➜ Network: use --host to expose
```

### Terminal 3 - Check Logs (Optional):

```bash
# Backend logs
cd backend
npm start 2>&1 | tee backend.log

# Frontend logs  
cd frontend
npm run dev 2>&1 | tee frontend.log
```

---

## ✅ Verify Updates Are Working

Open http://localhost:5173 in your browser and check:

### 1. Check Browser Console (F12)

Should see:
```
✅ No red errors
✅ API calls to http://localhost:5000
✅ SEO components loading
```

### 2. Check Network Tab

Should see API calls to:
```
http://localhost:5000/api/properties
http://localhost:5000/api/seo/sitemap.xml
http://localhost:5000/health
```

### 3. Check Page Source (Right-click → View Page Source)

Should see SEO meta tags:
```html
<meta property="og:title" content="...">
<meta name="description" content="...">
<script type="application/ld+json">...</script>
```

### 4. Test New Features

Try accessing these pages:
- http://localhost:5173/ - Homepage with SEO
- http://localhost:5173/properties - Property listings
- http://localhost:5173/ai-recommendations - AI recommendations (Phase 8)
- http://localhost:5173/home-loans - Home loan calculator (Phase 8)

---

## 🐛 Troubleshooting

### Issue: "Module not found: react-helmet-async"

**Fix:**
```bash
cd frontend
npm install react-helmet-async prop-types
npm run dev
```

### Issue: "Cannot find module './routes/seoRoutes'"

**Fix:**
```bash
# You don't have latest code
git pull origin claude/real-estate-portal-complete-011CV3wsLxf76Zb7qCmePaVW
cd backend
npm install
```

### Issue: "Database connection error"

**Fix:**
```bash
# Check PostgreSQL is running
sudo service postgresql status
# Or: pg_isready

# If not running, start it
sudo service postgresql start
```

### Issue: "Port 5000 already in use"

**Fix:**
```bash
# Find process using port 5000
lsof -i :5000
# Or: netstat -ano | grep 5000

# Kill it
kill -9 <PID>

# Or change port in backend/.env
PORT=5001
```

### Issue: "Frontend shows blank page"

**Fix:**
```bash
cd frontend

# Clear everything
rm -rf node_modules .vite dist

# Reinstall
npm install

# Start fresh
npm run dev
```

### Issue: "CORS errors"

**Fix:**
Check backend/.env has:
```env
FRONTEND_URL=http://localhost:5173
```

Restart backend after changing.

---

## 📦 Verify Installed Packages

**Backend:**
```bash
cd backend
npm list --depth=0 | grep -E "express|sequelize|socket"
```

**Frontend:**
```bash
cd frontend
npm list --depth=0 | grep -E "react|vite|helmet"
```

Should see:
```
react@18.2.0
react-helmet-async@2.0.4
vite@4.x.x
```

---

## 🔄 Start Fresh (Nuclear Option)

If nothing works, start completely fresh:

```bash
# 1. Delete everything
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json frontend/.vite frontend/dist

# 2. Pull latest code
git fetch origin
git reset --hard origin/claude/real-estate-portal-complete-011CV3wsLxf76Zb7qCmePaVW

# 3. Install everything
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 4. Start
# Terminal 1: cd backend && npm start
# Terminal 2: cd frontend && npm run dev
```

---

## ✨ What's New (Features You Should See)

After setup, you should have:

### Phase 8 Features:
- ✅ 360° Virtual Tours
- ✅ AI-Powered Recommendations
- ✅ Home Loan Calculator & Application
- ✅ Video Call Tours (booking system)
- ✅ Advanced Analytics Dashboard

### SEO Features:
- ✅ Dynamic XML Sitemap
- ✅ Robots.txt
- ✅ Meta tags (Open Graph, Twitter Cards)
- ✅ Schema.org structured data
- ✅ Google Analytics 4 integration

### Test These URLs:
- http://localhost:5000/api/seo/sitemap.xml
- http://localhost:5000/api/seo/robots.txt
- http://localhost:5000/api/virtual-tours
- http://localhost:5000/api/ai-recommendations
- http://localhost:5000/api/home-loans/banks

---

## 📞 Still Not Working?

If you've tried everything:

1. **Check your Node.js version:**
   ```bash
   node --version  # Should be 18.x or higher
   ```

2. **Check your npm version:**
   ```bash
   npm --version  # Should be 9.x or higher
   ```

3. **Share these with me:**
   - Error messages from terminal
   - Browser console errors (F12)
   - Which step failed
   - Operating system

---

**TIP:** Use the automated script for fastest setup:
```bash
./setup-local.sh
```

Then follow the terminal output to start backend and frontend!
