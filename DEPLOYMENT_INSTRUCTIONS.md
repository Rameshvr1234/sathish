# 🚀 Production Deployment Instructions

## Current Status
✅ All code committed and pushed to GitHub
✅ Ready for production deployment

## Deployment Options

You have 3 options for deployment. Choose the one that works best for you:

---

## Option 1: Web-Based Deployment (Recommended - No CLI Needed)

### A. Deploy Backend to Railway (via Web Interface)

1. **Go to Railway**: https://railway.app/
2. **Sign up/Login** with GitHub
3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository: `Rameshvr1234/sathish`
   - Select root path: `/backend`
4. **Add PostgreSQL Database**:
   - In your project, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will auto-provision a database
5. **Configure Environment Variables**:
   - Click on your backend service
   - Go to "Variables" tab
   - Add these variables:

   ```env
   NODE_ENV=production
   PORT=5000

   # Database (will be auto-filled by Railway)
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}

   # JWT Secret (generate a random 32+ character string)
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars-here

   # Razorpay (get from https://dashboard.razorpay.com)
   RAZORPAY_KEY_ID=rzp_live_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret

   # AWS S3 (optional - for image uploads)
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-bucket-name
   ```

6. **Deploy**:
   - Railway will automatically deploy
   - Wait for deployment to complete (3-5 minutes)

7. **Run Database Migrations**:
   - In Railway dashboard, click on your backend service
   - Go to "Settings" tab
   - Scroll to "Service" section
   - Under "Build & Deploy", you can add a custom build command
   - Or use the Railway CLI from your local machine (see Option 2)

8. **Get Your Backend URL**:
   - Click on your backend service
   - Go to "Settings" tab
   - Under "Domains", click "Generate Domain"
   - Copy the URL (e.g., `https://your-app.railway.app`)

### B. Deploy Frontend to Vercel (via Web Interface)

1. **Go to Vercel**: https://vercel.com/
2. **Sign up/Login** with GitHub
3. **Import Project**:
   - Click "Add New" → "Project"
   - Select your repository: `Rameshvr1234/sathish`
   - Framework Preset: "Vite"
   - Root Directory: `frontend`
4. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. **Environment Variables**:
   - Click "Environment Variables"
   - Add these:

   ```env
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id
   ```

   **IMPORTANT**: Replace `your-backend.railway.app` with your actual Railway backend URL from step A8

6. **Deploy**:
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)

7. **Get Your Frontend URL**:
   - After deployment, you'll see your live URL
   - Copy it (e.g., `https://your-app.vercel.app`)

---

## Option 2: Command Line Deployment (From Your Local Machine)

### Prerequisites
```bash
# Install Railway CLI
npm install -g @railway/cli

# Install Vercel CLI
npm install -g vercel
```

### A. Deploy Backend to Railway

```bash
# Navigate to backend directory
cd backend

# Login to Railway
railway login
# This will open browser for authentication

# Initialize Railway project
railway init
# Select "Create new project"
# Name it: "realestate-backend"

# Link to PostgreSQL
railway add
# Select "PostgreSQL"

# Set environment variables (one by one)
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set JWT_SECRET=your-super-secret-jwt-key-min-32-chars
railway variables set RAZORPAY_KEY_ID=rzp_live_your_key_id
railway variables set RAZORPAY_KEY_SECRET=your_razorpay_secret
# Add other variables as needed

# Deploy
railway up

# Run migrations
railway run npm run migrate

# Get your backend URL
railway status
# Copy the URL shown
```

### B. Deploy Frontend to Vercel

```bash
# Navigate to frontend directory
cd ../frontend

# Login to Vercel
vercel login

# Set environment variables
vercel env add VITE_API_URL
# Enter: https://your-backend.railway.app/api

vercel env add VITE_RAZORPAY_KEY_ID
# Enter: rzp_live_your_key_id

# Deploy to production
vercel --prod

# Your frontend URL will be displayed
```

---

## Option 3: Docker Deployment (On Your Own VPS/Server)

### Prerequisites
- A VPS/Server (DigitalOcean, AWS EC2, Linode, etc.)
- Docker and Docker Compose installed

### Steps

1. **SSH into your server**:
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Docker** (if not installed):
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

3. **Clone repository**:
   ```bash
   git clone https://github.com/Rameshvr1234/sathish.git
   cd sathish
   ```

4. **Setup environment**:
   ```bash
   cp .env.docker .env
   nano .env
   # Edit with your production values
   ```

5. **Start services**:
   ```bash
   docker compose up -d
   ```

6. **Check status**:
   ```bash
   docker compose ps
   docker compose logs -f
   ```

7. **Setup domain** (optional):
   - Point your domain DNS to server IP
   - Setup Nginx reverse proxy
   - Enable SSL with Let's Encrypt

---

## Post-Deployment Checklist

### 1. Verify Backend
```bash
# Health check
curl https://your-backend.railway.app/health

# Test API
curl https://your-backend.railway.app/api/regions
```

### 2. Verify Frontend
- Open: https://your-frontend.vercel.app
- Test user registration
- Test login
- Test browsing properties
- Test posting property (if seller)
- Test service booking

### 3. Database Verification
- Check that tables are created
- Verify migrations ran successfully
- Optionally seed demo data

### 4. Configure Mobile App

Update mobile app environment:
```bash
cd mobile
nano .env
```

Change to production URLs:
```env
API_URL=https://your-backend.railway.app/api
RAZORPAY_KEY_ID=rzp_live_your_key_id
```

Rebuild mobile app:
```bash
# Android
cd android && ./gradlew clean && cd ..
npm run android

# iOS
cd ios && pod install && cd ..
npm run ios
```

### 5. Update CORS Settings

In `backend/src/middleware/cors.js`, add your frontend domain:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend.vercel.app',  // Add this
];
```

Commit and push:
```bash
git add backend/src/middleware/cors.js
git commit -m "Add production frontend URL to CORS"
git push origin claude/real-estate-portal-complete-011CV3wsLxf76Zb7qCmePaVW
```

Railway will auto-deploy the update.

---

## Important Security Notes

### 1. Use Live Razorpay Keys
- Go to: https://dashboard.razorpay.com
- Switch to "Live Mode"
- Generate new Key ID and Secret
- Update in Railway and Vercel environment variables

### 2. Use Strong JWT Secret
Generate a secure random string:
```bash
openssl rand -base64 32
```

### 3. Setup AWS S3 (for image uploads)
- Create S3 bucket
- Configure IAM user with S3 permissions
- Add credentials to Railway environment

### 4. Enable Database Backups
- In Railway: Settings → Database → Backups
- Enable automatic daily backups

### 5. Setup Error Monitoring (Optional)
- Sign up for Sentry: https://sentry.io
- Add Sentry DSN to environment variables
- Monitor errors in production

---

## Troubleshooting

### Backend Not Starting
1. Check Railway logs: Dashboard → Service → Logs
2. Verify all environment variables are set
3. Check database connection
4. Verify migrations ran successfully

### Frontend Not Connecting to Backend
1. Verify `VITE_API_URL` is correct
2. Check CORS settings in backend
3. Verify backend is running and accessible
4. Check browser console for errors

### Database Connection Failed
1. Verify `DATABASE_URL` or individual DB variables are set
2. Check Railway PostgreSQL service is running
3. Verify network connectivity
4. Check database credentials

### Migrations Failed
1. Check Railway logs for error details
2. Verify database exists and is accessible
3. Run migrations manually via Railway CLI:
   ```bash
   railway run npm run migrate
   ```

---

## Next Steps After Deployment

1. **Custom Domain** (Optional):
   - Railway: Settings → Domains → Add Custom Domain
   - Vercel: Settings → Domains → Add Domain

2. **SSL Certificates**:
   - Automatically provided by Railway and Vercel

3. **Monitoring**:
   - Railway: Built-in metrics
   - Vercel: Built-in analytics
   - Optional: Add Sentry for error tracking

4. **CI/CD**:
   - Both Railway and Vercel support auto-deploy on git push
   - Or setup GitHub Actions (already configured in `.github/workflows/`)

5. **Mobile App Distribution**:
   - Build production APK/AAB for Android
   - Submit to Google Play Store
   - Build production IPA for iOS
   - Submit to Apple App Store

---

## Support

If you encounter issues:
1. Check Railway/Vercel documentation
2. Review error logs
3. Check environment variables
4. Verify all services are running
5. Test API endpoints individually

**Railway Docs**: https://docs.railway.app/
**Vercel Docs**: https://vercel.com/docs

---

## Estimated Costs

- **Railway**:
  - Free tier: $5 credit/month
  - Paid: ~$5-20/month depending on usage

- **Vercel**:
  - Free tier: Generous limits
  - Paid: $20/month (Pro) if needed

- **Total**: $0-40/month depending on traffic

---

Good luck with your deployment! 🚀
