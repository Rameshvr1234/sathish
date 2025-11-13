# Real Estate Portal - Quick Deployment Guide

## 🚀 Quick Start Deployment

This guide will help you deploy your Real Estate Portal to production quickly.

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] GitHub repository with your code
- [ ] Railway account (for backend) - https://railway.app
- [ ] Vercel account (for frontend) - https://vercel.com
- [ ] Google Analytics 4 property
- [ ] Razorpay account
- [ ] Email service credentials (Gmail or SendGrid)

## 🎯 Deployment Options

### Option 1: Railway + Vercel (Recommended - Easiest)

**Best for:** Quick deployment with automatic scaling and SSL

**Steps:**

1. **Deploy Backend to Railway**
   ```bash
   ./deploy-railway.sh
   ```
   
   Or manually:
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository and `backend` folder
   - Add PostgreSQL database from Railway
   - Add environment variables (see below)
   - Deploy!

2. **Deploy Frontend to Vercel**
   ```bash
   ./deploy-vercel.sh
   ```
   
   Or manually:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variables (see below)
   - Deploy!

**Time:** ~15 minutes  
**Cost:** Free tier available (suitable for testing/small scale)

### Option 2: Docker Compose (Self-Hosted)

**Best for:** Full control, running on your own VPS

**Steps:**

1. **Prepare VPS** (Ubuntu 20.04+ recommended)
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install Docker Compose
   sudo apt-get install docker-compose-plugin
   ```

2. **Clone and Configure**
   ```bash
   git clone <your-repo>
   cd real-estate-portal
   ```

3. **Edit .env file**
   ```bash
   nano .env
   # Add your credentials
   ```

4. **Deploy**
   ```bash
   ./deploy-docker.sh
   ```

**Time:** ~30 minutes  
**Cost:** VPS cost (~$5-20/month)

### Option 3: Traditional VPS Deployment

**Best for:** Custom configurations, existing infrastructure

See `DEPLOYMENT_GUIDE.md` for detailed VPS deployment instructions.

## 🔑 Required Environment Variables

### Backend (.env or Railway Variables)

```env
# Required
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app

# Database (auto-configured by Railway if using their DB)
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=real_estate_portal
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# Security
JWT_SECRET=your-super-secret-jwt-key-32-chars-min

# Razorpay (Required for payments)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret

# Email (Required for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional - Video calls
AGORA_APP_ID=your-agora-app-id
AGORA_APP_CERTIFICATE=your-certificate
```

### Frontend (.env or Vercel Environment Variables)

```env
# Required
VITE_API_URL=https://your-backend.railway.app

# Optional but recommended
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
VITE_AGORA_APP_ID=your-agora-app-id
```

## 📝 Step-by-Step: Railway + Vercel Deployment

### Part 1: Backend on Railway (10 minutes)

1. **Sign up/Login to Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your repository
   - Select `real-estate-portal` repository

3. **Configure Build Settings**
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `node server.js`

4. **Add PostgreSQL Database**
   - In your project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will auto-configure DB_HOST, DB_USER, DB_PASSWORD, etc.

5. **Add Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Add all backend environment variables from above
   - Railway will automatically inject DB variables

6. **Generate Domain**
   - Go to "Settings" tab
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://your-app.railway.app`)

7. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Check logs for any errors

### Part 2: Frontend on Vercel (5 minutes)

1. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your repository
   - Framework Preset: Vite
   - Root Directory: `frontend`

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add:
     - `VITE_API_URL` = Your Railway URL from Part 1
     - `VITE_GA_MEASUREMENT_ID` = Your GA4 ID
     - `VITE_RAZORPAY_KEY_ID` = Your Razorpay key
     - `VITE_AGORA_APP_ID` = Your Agora app ID (if using)

5. **Deploy**
   - Click "Deploy"
   - Wait for build (~1-2 minutes)
   - Your site will be live at `https://your-app.vercel.app`

6. **Update Backend FRONTEND_URL**
   - Go back to Railway
   - Update `FRONTEND_URL` variable with your Vercel URL
   - Redeploy backend

### Part 3: Post-Deployment Setup (5 minutes)

1. **Test the Application**
   - Visit your Vercel URL
   - Try registering a new user
   - Try listing a property
   - Test payment integration

2. **Set up Google Analytics**
   - Go to https://analytics.google.com
   - Create GA4 property
   - Add Measurement ID to Vercel environment variables
   - Redeploy frontend

3. **Submit Sitemap**
   - Go to https://search.google.com/search-console
   - Add your site
   - Verify ownership
   - Submit sitemap: `https://your-site.vercel.app/sitemap.xml`

4. **Set up Custom Domain (Optional)**
   - In Vercel: Settings → Domains → Add your domain
   - In Railway: Settings → Add custom domain
   - Update DNS records as instructed

## ✅ Deployment Checklist

Use this checklist to ensure everything is properly configured:

### Pre-Deployment
- [ ] All code committed and pushed to GitHub
- [ ] Environment variables prepared
- [ ] Third-party accounts created (Railway, Vercel, Razorpay, etc.)
- [ ] Database backup strategy planned

### Backend Deployment
- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] Environment variables set
- [ ] Backend deployed successfully
- [ ] Health check passing (`/health` endpoint)
- [ ] Database tables created (first run auto-syncs)

### Frontend Deployment
- [ ] Vercel project created
- [ ] Environment variables set (including Railway URL)
- [ ] Frontend deployed successfully
- [ ] API calls working (check browser console)
- [ ] All pages loading correctly

### Post-Deployment
- [ ] User registration working
- [ ] User login working
- [ ] Property listing working
- [ ] Image uploads working
- [ ] Payment flow tested
- [ ] Email notifications working
- [ ] Sitemap accessible (`/sitemap.xml`)
- [ ] Robots.txt accessible (`/robots.txt`)
- [ ] Google Analytics tracking
- [ ] SSL certificate active (automatic on Railway/Vercel)

### SEO Setup
- [ ] Google Analytics configured
- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] Structured data validated (use Google's Rich Results Test)
- [ ] Meta tags verified (use Facebook Sharing Debugger)

## 🔧 Troubleshooting

### Backend Issues

**Problem:** Database connection error
```
Solution:
1. Check Railway database variables are set
2. Verify DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
3. Check Railway logs for specific errors
```

**Problem:** 502 Bad Gateway
```
Solution:
1. Check backend logs in Railway
2. Verify PORT is set to 5000
3. Ensure server.js is starting correctly
4. Check health endpoint: /health
```

**Problem:** JWT authentication failing
```
Solution:
1. Verify JWT_SECRET is set and at least 32 characters
2. Check FRONTEND_URL matches your Vercel URL
3. Clear browser cookies and try again
```

### Frontend Issues

**Problem:** API calls failing (CORS errors)
```
Solution:
1. Verify VITE_API_URL points to Railway backend
2. Check FRONTEND_URL in Railway matches Vercel URL
3. Check browser console for exact error
4. Verify Railway backend is running
```

**Problem:** Environment variables not working
```
Solution:
1. Ensure all VITE_ variables are set in Vercel
2. Redeploy frontend after adding variables
3. Clear browser cache
4. Check: console.log(import.meta.env.VITE_API_URL)
```

**Problem:** 404 on page refresh
```
Solution:
This should be handled by vercel.json routing, but if issues persist:
1. Check vercel.json is in frontend directory
2. Verify routes configuration
3. Redeploy
```

### Database Issues

**Problem:** Tables not created
```
Solution:
1. Check backend logs for sync errors
2. Manually trigger sync (visit any API endpoint)
3. Check PostgreSQL connection
4. Verify Sequelize sync in server.js
```

## 📊 Monitoring Your Deployment

### Railway (Backend)
- View logs: Railway Dashboard → Your Service → Logs
- Metrics: Railway Dashboard → Your Service → Metrics
- Database: Railway Dashboard → PostgreSQL → Data

### Vercel (Frontend)
- View deployments: Vercel Dashboard → Your Project → Deployments
- Analytics: Vercel Dashboard → Your Project → Analytics
- Logs: Click on any deployment → View Function Logs

### Google Analytics
- Real-time data: Google Analytics → Reports → Realtime
- Traffic: Google Analytics → Reports → Acquisition → Traffic acquisition

## 💰 Cost Estimation

### Free Tier (Good for testing/small scale)
- Railway: $5 free credit (no credit card required)
- Vercel: Free for personal projects
- PostgreSQL: 512MB on Railway free tier
- **Total: $0** (for testing)

### Production Scale (Recommended)
- Railway: ~$20/month (includes database)
- Vercel: Free (or $20/month for Pro features)
- PostgreSQL: Included with Railway or $10/month separate
- **Total: ~$20-30/month**

### High Traffic Scale
- Railway: ~$50-100/month
- Vercel: $20/month Pro plan
- PostgreSQL: $50/month for larger database
- CDN: $10-20/month (CloudFlare free tier available)
- **Total: ~$80-190/month**

## 🎯 Next Steps After Deployment

1. **Monitor Performance**
   - Set up error tracking (Sentry)
   - Monitor uptime (UptimeRobot)
   - Check analytics daily

2. **Marketing**
   - Submit to property listing directories
   - Start SEO blog content
   - Social media presence
   - PPC campaigns

3. **Continuous Improvement**
   - Collect user feedback
   - A/B test features
   - Optimize performance
   - Add new features

## 📞 Need Help?

If you encounter issues:

1. Check logs in Railway/Vercel
2. Review this guide's troubleshooting section
3. Check Railway/Vercel documentation
4. Test locally with `docker-compose up`

## 🔄 Updating Your Deployment

### Quick Updates
```bash
# Make your changes locally
git add .
git commit -m "Update feature X"
git push

# Railway and Vercel will auto-deploy from GitHub
```

### Rollback if Needed
- Railway: Go to Deployments → Click on previous deployment → Redeploy
- Vercel: Go to Deployments → Click on previous deployment → Promote to Production

## 🎉 Success!

If you've followed all steps, your Real Estate Portal should now be live and accessible worldwide!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-app.railway.app`
- Database: Managed by Railway

**Next:**
- Share your site!
- Monitor analytics
- Gather user feedback
- Iterate and improve

---

*For detailed deployment information, see `DEPLOYMENT_GUIDE.md`*
*For production optimization, see `PROJECT_FINAL_SUMMARY.md`*
