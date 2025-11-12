# 🚀 Complete Deployment Guide

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Database Deployment (Railway PostgreSQL)](#database-deployment)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Environment Variables](#environment-variables)
6. [Custom Domain Setup](#custom-domain-setup)
7. [Monitoring & Maintenance](#monitoring-maintenance)
8. [Alternative Deployment Options](#alternatives)

---

## 1. Pre-Deployment Checklist

### ✅ Before You Deploy

```
□ All tests passing
□ Environment variables documented
□ Database schema finalized
□ API endpoints tested
□ Frontend connects to backend successfully
□ Error handling implemented
□ Security measures in place
□ Performance optimized
□ Documentation complete
□ Backup strategy planned
```

### Required Accounts
- [ ] GitHub account (code repository)
- [ ] Railway account (backend + database)
- [ ] Vercel account (frontend)
- [ ] AWS account (S3 for images) - Optional
- [ ] Razorpay account (payments)
- [ ] SendGrid account (emails) - Optional

---

## 2. Backend Deployment (Railway)

### Why Railway?
- ✅ Free tier available
- ✅ PostgreSQL included
- ✅ Automatic deployments from GitHub
- ✅ Built-in environment variables
- ✅ Easy scaling

### Step-by-Step Deployment

#### Step 1: Prepare Backend for Production

**Update `backend/package.json`:**
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "echo 'No build step required'",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

**Update `backend/server.js` for production:**
```javascript
// At the top
const PORT = process.env.PORT || 5000;

// Update CORS for production
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

#### Step 2: Push to GitHub

```bash
git add -A
git commit -m "Prepare for production deployment"
git push origin main
```

#### Step 3: Deploy to Railway

1. **Go to** https://railway.app/
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Railway will detect Node.js**

#### Step 4: Add PostgreSQL Database

1. In Railway dashboard, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway will create and connect the database
3. Note the connection details

#### Step 5: Configure Environment Variables

In Railway Project Settings → Variables, add:

```bash
# Node Environment
NODE_ENV=production

# Database (Auto-populated by Railway PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# OR manually set:
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

# JWT
JWT_SECRET=your_super_long_secret_key_minimum_32_characters_long
JWT_EXPIRE=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# AWS S3 (for image uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your-production-bucket
AWS_REGION=ap-south-1

# Email (SendGrid)
SENDGRID_API_KEY=SG.your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=PropertyPortal

# Frontend URL (will be updated after frontend deployment)
FRONTEND_URL=https://your-frontend.vercel.app
```

#### Step 6: Deploy

1. Railway will automatically deploy
2. Wait for build to complete
3. You'll get a URL like: `https://your-app.railway.app`

#### Step 7: Test Backend

```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

---

## 3. Database Deployment

### Railway PostgreSQL (Included)

Railway PostgreSQL is automatically configured. To manage:

**View Database:**
```bash
# In Railway dashboard
Click on PostgreSQL service → Data tab
```

**Connect Locally:**
```bash
# Get connection string from Railway
DATABASE_URL=postgresql://user:pass@host:port/db

# Connect with psql
psql $DATABASE_URL
```

**Run Migrations:**
```bash
# Sequelize will auto-sync tables
# Or manually run migrations if you have them
```

**Create Super Admin:**
```bash
# Use API endpoint or run script
curl -X POST https://your-app.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "admin@yourdomain.com",
    "phone": "1234567890",
    "password": "StrongPassword@123",
    "role": "super_admin"
  }'
```

### Alternative: AWS RDS PostgreSQL

**For production at scale:**

1. **Go to AWS RDS Console**
2. **Create Database** → PostgreSQL
3. **Settings:**
   - Instance size: db.t3.micro (free tier)
   - Storage: 20GB
   - Enable automated backups
4. **Update Railway Environment:**
   ```
   DB_HOST=your-rds-endpoint.rds.amazonaws.com
   DB_PORT=5432
   DB_NAME=real_estate_portal
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

---

## 4. Frontend Deployment (Vercel)

### Why Vercel?
- ✅ Free tier for personal projects
- ✅ Automatic deployments from GitHub
- ✅ Global CDN
- ✅ Zero configuration
- ✅ Environment variables support

### Step-by-Step Deployment

#### Step 1: Prepare Frontend

**Update `frontend/.env.production`:**
```bash
VITE_API_URL=https://your-backend.railway.app/api
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id
```

**Update `frontend/vite.config.js`:**
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
```

#### Step 2: Commit Changes

```bash
git add -A
git commit -m "Configure for Vercel deployment"
git push origin main
```

#### Step 3: Deploy to Vercel

1. **Go to** https://vercel.com/
2. **Sign up/Login** with GitHub
3. **Click "Add New Project"**
4. **Import your repository**
5. **Configure:**
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### Step 4: Add Environment Variables

In Vercel Project Settings → Environment Variables:

```bash
VITE_API_URL=https://your-backend.railway.app/api
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id
```

#### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. You'll get a URL like: `https://your-app.vercel.app`

#### Step 6: Update Backend CORS

Go back to Railway and update:
```bash
FRONTEND_URL=https://your-app.vercel.app
```

Redeploy backend.

#### Step 7: Test Frontend

1. Visit `https://your-app.vercel.app`
2. Register new user
3. Test all features

---

## 5. Environment Variables

### Backend Production Variables

```bash
# Required
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=generate_with_openssl_rand_base64_32
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=live_secret_xxx
FRONTEND_URL=https://your-app.vercel.app

# Recommended
SENDGRID_API_KEY=SG.xxx
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=production-bucket
AWS_REGION=ap-south-1

# Optional
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
REDIS_URL=redis://xxx (for caching)
```

### Frontend Production Variables

```bash
VITE_API_URL=https://your-backend.railway.app/api
VITE_RAZORPAY_KEY_ID=rzp_live_xxx
```

---

## 6. Custom Domain Setup

### For Backend (Railway)

1. **In Railway Project Settings → Domains**
2. **Add Custom Domain:** api.yourdomain.com
3. **Add DNS Records at your domain provider:**
   ```
   Type: CNAME
   Name: api
   Value: your-app.railway.app
   ```
4. **Wait for DNS propagation** (5-30 minutes)
5. **Update environment variables:**
   ```
   FRONTEND_URL=https://yourdomain.com
   ```

### For Frontend (Vercel)

1. **In Vercel Project Settings → Domains**
2. **Add Domain:** yourdomain.com
3. **Add DNS Records:**
   ```
   Type: A
   Name: @
   Value: 76.76.19.19

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. **Update backend CORS:**
   ```
   FRONTEND_URL=https://yourdomain.com
   ```

---

## 7. Monitoring & Maintenance

### Application Monitoring

**Sentry (Error Tracking):**

```bash
# Backend
npm install @sentry/node

# server.js
const Sentry = require('@sentry/node');
Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: process.env.NODE_ENV,
});

# Frontend
npm install @sentry/react

# main.jsx
import * as Sentry from '@sentry/react';
Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: import.meta.env.MODE,
});
```

**LogRocket (Session Replay):**

```bash
npm install logrocket

# main.jsx
import LogRocket from 'logrocket';
LogRocket.init('your-app-id');
```

### Database Backups

**Railway Backups:**
- Automatic daily backups (Pro plan)
- Manual backups available

**AWS RDS Backups:**
```bash
# Automated backups enabled
# Retention period: 7-35 days
# Point-in-time recovery available
```

### Performance Monitoring

**Google Analytics:**
```html
<!-- Add to frontend/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Uptime Monitoring:**
- Use UptimeRobot (free)
- Monitor: https://your-backend.railway.app/health
- Email alerts on downtime

---

## 8. Alternative Deployment Options

### Option A: Heroku

**Backend:**
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
heroku addons:create heroku-postgresql:mini
heroku config:set NODE_ENV=production JWT_SECRET=xxx
git push heroku main
```

**Cost:** $7/month (Eco plan)

### Option B: AWS (EC2 + RDS)

**Backend:**
1. Launch EC2 instance (t2.micro - free tier)
2. Install Node.js
3. Clone repository
4. Setup nginx reverse proxy
5. Use PM2 for process management

**Database:**
1. Launch RDS PostgreSQL
2. Configure security groups

**Cost:** Free tier eligible

### Option C: DigitalOcean

**Backend:**
```bash
# Create Droplet
# Install Node.js, PostgreSQL, nginx
# Deploy with PM2
```

**Cost:** $6/month (Basic droplet)

### Option D: Netlify (Frontend Alternative)

```bash
netlify deploy --prod --dir=frontend/dist
```

---

## Deployment Checklist

### ✅ Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables prepared
- [ ] Production database ready
- [ ] Payment gateway in live mode
- [ ] Error tracking setup

### ✅ Backend Deployment
- [ ] Backend deployed to Railway
- [ ] PostgreSQL database created
- [ ] Environment variables set
- [ ] Health endpoint working
- [ ] API endpoints accessible

### ✅ Frontend Deployment
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] Backend API connected
- [ ] All pages loading
- [ ] Assets loading correctly

### ✅ Post-Deployment
- [ ] Custom domains configured
- [ ] SSL certificates active
- [ ] CORS properly configured
- [ ] Super admin created
- [ ] Sample data loaded
- [ ] Monitoring tools active
- [ ] Backup strategy implemented

### ✅ Final Testing
- [ ] User registration works
- [ ] Login works
- [ ] Property listing works
- [ ] Service bookings work
- [ ] Payment gateway works
- [ ] Chat works
- [ ] Admin dashboards work

---

## Production URLs

```
Backend:     https://your-app.railway.app
Frontend:    https://your-app.vercel.app
Database:    (Railway managed)

Custom:
Backend:     https://api.yourdomain.com
Frontend:    https://yourdomain.com
```

---

## Quick Deployment Commands

```bash
# Backend (Railway)
git push origin main  # Auto-deploys

# Frontend (Vercel)
git push origin main  # Auto-deploys

# Manual frontend deploy
cd frontend
npm run build
vercel --prod

# Database migration
# Connect to Railway DB and run migrations
```

---

## Troubleshooting

### Issue: Backend not starting
```bash
# Check logs in Railway dashboard
# Verify environment variables
# Check DATABASE_URL is set
```

### Issue: Frontend can't connect to backend
```bash
# Verify VITE_API_URL is correct
# Check CORS settings in backend
# Verify backend is running
```

### Issue: Database connection failed
```bash
# Check DATABASE_URL format
# Verify database is running
# Check firewall rules
```

### Issue: Images not uploading
```bash
# Verify AWS S3 credentials
# Check bucket permissions
# Verify CORS policy on S3
```

---

## Cost Estimate

### Free Tier (Development)
- Railway: Free (with limits)
- Vercel: Free (personal projects)
- PostgreSQL: Included with Railway
- **Total: $0/month**

### Production (Small Scale)
- Railway Pro: $20/month
- Vercel Pro: $20/month (optional)
- AWS S3: ~$5/month
- SendGrid: $15/month (optional)
- **Total: $25-60/month**

### Production (Medium Scale)
- Railway Pro: $20/month
- AWS RDS: $25/month
- AWS S3: $10/month
- Monitoring tools: $20/month
- **Total: $75-100/month**

---

**Your application is now LIVE in production!** 🚀

Next: Monitor performance, gather user feedback, and iterate!
