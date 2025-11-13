# Railway Manual Deployment - Step by Step Guide

## 🚀 Complete Railway Deployment Guide

Since CLI isn't available, follow these exact steps in the Railway web dashboard.

---

## Part 1: Access Railway Dashboard

1. Open your browser and go to: **https://railway.app**
2. Click **"Login"** or **"Start a New Project"**
3. Sign in with your **GitHub account**

---

## Part 2: Create New Project (or Fix Existing)

### If you already have a project that failed:

1. Go to your existing project
2. Click on the **backend service**
3. **Skip to Part 4** to configure settings

### If creating new project:

1. Click **"New Project"** button
2. Select **"Deploy from GitHub repo"**
3. You may need to **"Configure GitHub App"** to grant Railway access
4. Select your repository: **sathish** (or your repo name)
5. Click **"Deploy Now"**

---

## Part 3: Add PostgreSQL Database

1. In your project dashboard, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will create and link the database automatically
5. Wait for database to initialize (~30 seconds)

---

## Part 4: Configure Backend Service Settings

Click on your **backend service** (not the database), then:

### A. Set Root Directory

1. Click **"Settings"** tab
2. Scroll down to find **"Root Directory"** or **"Source"** section
3. In the **Root Directory** field, enter: `backend`
4. The setting should auto-save

### B. Set Build Configuration

Look for **"Build"** or **"Build Command"** section:

1. **Build Command:** `npm install`
2. **Start Command:** `node server.js`
3. **Watch Paths:** Leave blank or enter `backend/**`

### C. Change Builder (Important!)

This is the key fix for your error:

1. Still in Settings, find **"Builder"** or **"Build Method"**
2. Change from **"NIXPACKS"** to **"DOCKERFILE"**
3. Save the change

Why? Your backend has a Dockerfile, and using it directly is more reliable than Nixpacks auto-detection.

---

## Part 5: Add Environment Variables

1. Click **"Variables"** tab in your service
2. Click **"+ New Variable"** for each of these:

### Required Variables (Add all of these):

```
NODE_ENV=production
```

```
PORT=5000
```

```
JWT_SECRET=your-super-secret-jwt-key-must-be-at-least-32-characters-long
```
*Generate a random 32+ character string for security*

```
FRONTEND_URL=https://your-frontend-url.vercel.app
```
*You'll update this after deploying frontend*

```
RAZORPAY_KEY_ID=your_razorpay_key_id
```

```
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

```
EMAIL_HOST=smtp.gmail.com
```

```
EMAIL_PORT=587
```

```
EMAIL_USER=your-email@gmail.com
```

```
EMAIL_PASSWORD=your-gmail-app-password
```

### Database Variables (Auto-configured)

These should already be set by Railway when you added PostgreSQL:
- `DATABASE_URL`
- `PGHOST`
- `PGPORT`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`

If not visible, that's okay - Railway links them automatically.

### Optional Variables (for Phase 8 features):

```
AGORA_APP_ID=your_agora_app_id
```

```
AGORA_APP_CERTIFICATE=your_agora_certificate
```

---

## Part 6: Generate Domain

1. Go to **"Settings"** tab
2. Scroll to **"Networking"** or **"Domains"** section
3. Click **"Generate Domain"**
4. Railway will create a URL like: `https://your-app.up.railway.app`
5. **Copy this URL** - you'll need it for Vercel!

---

## Part 7: Deploy

1. Go to **"Deployments"** tab
2. Click **"Deploy"** or **"Redeploy"** button
3. Watch the build logs in real-time

### What Success Looks Like:

```
#1 Building image...
#2 Installing dependencies
#3 npm install completed
#4 Starting application
#5 Server started successfully
✓ Deployment successful
```

### What Failure Looks Like:

```
✗ Error: creating build plan with Railpack
```

If you see this error again:
- Go back to Settings
- Verify Root Directory = `backend`
- Verify Builder = `DOCKERFILE` (not NIXPACKS)
- Save and redeploy

---

## Part 8: Verify Deployment

1. Once deployed, click **"View Logs"** in Deployments
2. Look for: `Server listening on port 5000` or similar
3. Click on your generated domain URL
4. You should see: `{"status":"OK"}` or similar response

Or test the health endpoint:
```
https://your-app.up.railway.app/health
```

---

## Part 9: Deploy Frontend to Vercel

Now deploy your frontend:

1. Go to **https://vercel.com**
2. Sign in with GitHub
3. Click **"New Project"**
4. Import your repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click **"Deploy"**

### Add Environment Variables in Vercel:

1. Go to your project **"Settings"** → **"Environment Variables"**
2. Add these:

```
VITE_API_URL=https://your-app.up.railway.app
```
*Use your Railway backend URL from Part 6*

```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
*Your Google Analytics ID (optional)*

```
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

```
VITE_AGORA_APP_ID=your_agora_app_id
```

3. Click **"Redeploy"** to apply environment variables

---

## Part 10: Connect Backend and Frontend

1. Copy your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
2. Go back to **Railway**
3. Go to **Variables** tab in backend service
4. **Update** the `FRONTEND_URL` variable with your Vercel URL
5. Railway will auto-redeploy

---

## Part 11: Test Your Application

1. Visit your Vercel frontend URL
2. Try these actions:
   - ✅ Register a new user
   - ✅ Login
   - ✅ Browse properties
   - ✅ List a property (if you're a seller)

3. Check browser console (F12) for any API errors

---

## 🔧 Troubleshooting

### Error: "Application failed to start"

**Check Logs:**
1. Railway → Deployments → Click on deployment → View Logs
2. Look for specific error message

**Common fixes:**
- Verify all environment variables are set
- Check DATABASE_URL is configured
- Verify Root Directory = `backend`
- Try switching Builder to DOCKERFILE

### Error: "Database connection failed"

**Fix:**
1. Verify PostgreSQL addon is added
2. Check Variables tab - DATABASE_URL should be present
3. Try removing and re-adding PostgreSQL

### Error: "CORS errors in browser"

**Fix:**
1. Update Railway FRONTEND_URL variable with exact Vercel URL
2. Redeploy backend
3. Clear browser cache

### Error: "502 Bad Gateway"

**Fix:**
1. Check backend logs for crash errors
2. Verify PORT is set to 5000
3. Check server.js is starting correctly

---

## 📊 Cost Information

**Free Tier:**
- Railway: $5 free credit (no credit card required initially)
- Vercel: Free for personal projects
- Usage: Good for testing and low traffic

**Production:**
- Railway: ~$20/month (includes database)
- Vercel: Free (or $20/month Pro)

---

## ✅ Success Checklist

- [ ] Railway account created
- [ ] Backend service created from GitHub
- [ ] PostgreSQL database added
- [ ] Root Directory set to `backend`
- [ ] Builder set to `DOCKERFILE`
- [ ] All environment variables added
- [ ] Domain generated
- [ ] Backend deployed successfully
- [ ] Health endpoint returns OK
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables set
- [ ] FRONTEND_URL updated in Railway
- [ ] Application tested and working

---

## 🎉 You're Done!

Your Real Estate Portal should now be live!

**URLs:**
- Backend API: `https://your-app.up.railway.app`
- Frontend: `https://your-app.vercel.app`

**Next Steps:**
1. Set up custom domain (optional)
2. Configure Google Analytics
3. Submit sitemap to Google Search Console
4. Monitor application logs

---

## 📞 Need Help?

If you encounter errors:
1. Check Railway deployment logs
2. Check Vercel deployment logs
3. Review browser console (F12)
4. Check `RAILWAY_DEPLOYMENT_FIX.md` for more solutions

---

*For additional deployment options, see `DEPLOYMENT_QUICKSTART.md`*
