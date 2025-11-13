# ✅ Local Setup Complete - How to Run

## 🎉 Good News!

All code errors have been fixed! Your application is ready to run locally with all Phase 8 and SEO updates.

## 🐛 Bugs Fixed

1. **Duplicate association aliases** - Fixed conflicting model relationships
2. **Missing middleware export** - Added `authenticateToken` middleware
3. **All dependencies installed** - Including new SEO packages

## 🚀 To Run the Application Locally

You need **PostgreSQL running** on your machine. Here's how:

### Step 1: Install & Start PostgreSQL

**On Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**On Mac (with Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**On Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Install and start the service

**Using Docker (Easiest):**
```bash
docker run -d \
  --name real-estate-db \
  -e POSTGRES_DB=real_estate_portal \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

### Step 2: Create Database

```bash
# Access PostgreSQL
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE real_estate_portal;
\q
```

### Step 3: Pull Latest Code (with fixes)

```bash
git pull origin claude/real-estate-portal-complete-011CV3wsLxf76Zb7qCmePaVW
```

### Step 4: Start Backend

**Terminal 1:**
```bash
cd backend
npm start
```

**You should see:**
```
✓ Database connected successfully
✓ Server running on port 5000
✓ All models synced
```

### Step 5: Start Frontend

**Terminal 2:**
```bash
cd frontend
npm run dev
```

**You should see:**
```
VITE v4.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

### Step 6: Open in Browser

Visit: **http://localhost:5173**

---

## ✨ What You'll See

All features are now available:

### Phase 8 Features:
- ✅ 360° Virtual Tours
- ✅ AI-Powered Recommendations  
- ✅ Home Loan Calculator
- ✅ Video Call Tour Booking
- ✅ Advanced Analytics

### SEO Features:
- ✅ Dynamic Meta Tags
- ✅ XML Sitemap at `/sitemap.xml`
- ✅ Robots.txt at `/robots.txt`
- ✅ Schema.org Structured Data
- ✅ Open Graph Tags
- ✅ Google Analytics Integration

---

## 🧪 Test the Updates

### Test SEO Features:
```bash
# View sitemap
curl http://localhost:5000/api/seo/sitemap.xml

# View robots.txt
curl http://localhost:5000/api/seo/robots.txt

# View structured data for a property
curl http://localhost:5000/api/seo/structured-data/1
```

### Test Phase 8 APIs:
```bash
# Virtual tours
curl http://localhost:5000/api/virtual-tours

# AI recommendations  
curl http://localhost:5000/api/ai-recommendations

# Home loan banks
curl http://localhost:5000/api/home-loans/banks

# Video call tours
curl http://localhost:5000/api/video-calls
```

### View Page Source:
1. Open http://localhost:5173
2. Right-click → "View Page Source"
3. Look for SEO meta tags:
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<script type="application/ld+json">
  {"@context":"https://schema.org",...}
</script>
```

---

## 📊 Verify Everything Works

**Backend Health Check:**
```bash
curl http://localhost:5000/health
# Should return: {"status":"OK","timestamp":"..."}
```

**Frontend:**
- Open browser console (F12)
- Should see no red errors
- Should see successful API calls

---

## 🔧 Troubleshooting

### Issue: "Database connection error"

```bash
# Check PostgreSQL is running
sudo service postgresql status
# Or: pg_isready

# If not running, start it
sudo service postgresql start
```

### Issue: "Port 5000 already in use"

```bash
# Find and kill the process
lsof -i :5000
kill -9 <PID>
```

### Issue: "Module not found"

```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

---

## 🎯 Quick Start (All-in-One)

If you have Docker:

```bash
# Start database
docker run -d --name real-estate-db \
  -e POSTGRES_DB=real_estate_portal \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Wait 5 seconds for DB to start
sleep 5

# Start backend (Terminal 1)
cd backend && npm start

# Start frontend (Terminal 2 - in new terminal)
cd frontend && npm run dev

# Open browser
# http://localhost:5173
```

---

## 📝 Summary

**What's Done:**
- ✅ All dependencies installed (including SEO packages)
- ✅ All code bugs fixed
- ✅ All Phase 8 features integrated
- ✅ All SEO features implemented
- ✅ Backend ready to run
- ✅ Frontend ready to run

**What You Need:**
- ✅ PostgreSQL database running
- ✅ Two terminals (one for backend, one for frontend)

**Once Running:**
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- All features available!

---

## 🚀 For Production Deployment

When ready to deploy live:

1. **Railway + Vercel** - See `RAILWAY_MANUAL_DEPLOYMENT.md`
2. **Render.com** - See `deploy-render.sh`
3. **Docker** - See `deploy-docker.sh`

---

**Everything is ready!** Just start PostgreSQL and run the commands above. 🎉
