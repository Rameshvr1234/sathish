# Railway Deployment - Live Checklist

## ✅ Step-by-Step Progress Tracker

Use this as you deploy. Check off each item as you complete it.

---

## Step 1: Access Railway ✓
- [ ] Open browser
- [ ] Go to https://railway.app
- [ ] Click "Login" or "Start a New Project"
- [ ] Sign in with GitHub account
- [ ] Authorize Railway to access your repositories

**What you should see:** Railway dashboard with option to create new project

---

## Step 2: Create/Access Project
- [ ] Click "New Project" (or select existing failed project)
- [ ] Choose "Deploy from GitHub repo"
- [ ] Find and select your "sathish" repository
- [ ] Click "Deploy Now" or "Add Service"

**What you should see:** Railway starts creating your project

---

## Step 3: Add PostgreSQL Database
- [ ] In project dashboard, click "+ New" button
- [ ] Select "Database"
- [ ] Choose "Add PostgreSQL"
- [ ] Wait for green checkmark (database ready)

**What you should see:** PostgreSQL database card in your project

---

## Step 4: Configure Backend Service - Part A (Root Directory)
- [ ] Click on "backend" service (not database)
- [ ] Click "Settings" tab
- [ ] Find "Root Directory" field
- [ ] Enter: `backend`
- [ ] Verify it auto-saved

**What you should see:** Root Directory showing "backend"

---

## Step 4: Configure Backend Service - Part B (Builder) ⚠️ CRITICAL
- [ ] Still in Settings tab
- [ ] Find "Builder" dropdown
- [ ] Click dropdown (probably shows "NIXPACKS")
- [ ] Change to "DOCKERFILE"
- [ ] Verify change saved

**What you should see:** Builder showing "DOCKERFILE"

**This fixes your "creating build plan" error!**

---

## Step 4: Configure Backend Service - Part C (Commands)
- [ ] Still in Settings tab
- [ ] Find "Build Command" field
- [ ] Enter: `npm install`
- [ ] Find "Start Command" field
- [ ] Enter: `node server.js`
- [ ] Save if needed

**What you should see:** Both commands configured

---

## Step 5: Add Environment Variables (11 variables)

Click "Variables" tab, then add each variable below:

### Required Variables:

- [ ] **NODE_ENV** = `production`
- [ ] **PORT** = `5000`
- [ ] **JWT_SECRET** = `[32-char-random-string]`
      Example: `7K9mP2nQ5rT8wY1xZ3vC6bN4hJ7gF0dS8kL3mN9pQ2r`
- [ ] **FRONTEND_URL** = `http://localhost:5173` (temporary, update later)

### Payment & Email Variables:

- [ ] **RAZORPAY_KEY_ID** = `your_razorpay_key`
- [ ] **RAZORPAY_KEY_SECRET** = `your_razorpay_secret`
- [ ] **EMAIL_HOST** = `smtp.gmail.com`
- [ ] **EMAIL_PORT** = `587`
- [ ] **EMAIL_USER** = `your-email@gmail.com`
- [ ] **EMAIL_PASSWORD** = `your-gmail-app-password`

### Optional (Video Calls):

- [ ] **AGORA_APP_ID** = `your_agora_id` (skip if not using)

**Database variables (auto-configured by Railway):**
- DATABASE_URL ✓ (should already be there)
- PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD ✓

---

## Step 6: Generate Domain
- [ ] Go to "Settings" tab
- [ ] Scroll to "Networking" or "Domains" section
- [ ] Click "Generate Domain"
- [ ] Copy the generated URL
- [ ] **SAVE THIS URL** → `https://______________.up.railway.app`

---

## Step 7: Deploy Backend
- [ ] Click "Deployments" tab
- [ ] Click "Deploy" or "Redeploy" button
- [ ] Watch build logs

**Success indicators:**
- [ ] See "Building image..."
- [ ] See "npm install" completing
- [ ] See "Starting application"
- [ ] See "Deployment successful" ✓
- [ ] No errors in logs

**If you see "creating build plan" error:**
- Go back to Settings
- Verify Builder = DOCKERFILE (not NIXPACKS)
- Verify Root Directory = backend
- Redeploy

---

## Step 8: Test Backend
- [ ] Open new browser tab
- [ ] Visit: `https://your-railway-url.up.railway.app/health`
- [ ] Should see: `{"status":"OK",...}`

**If working, backend is LIVE!** ✅

---

## Step 9: Deploy Frontend to Vercel
- [ ] Open https://vercel.com
- [ ] Login with GitHub
- [ ] Click "New Project"
- [ ] Import your repository
- [ ] Configure:
      - Framework: Vite
      - Root Directory: `frontend`
      - Build Command: `npm run build`
      - Output Directory: `dist`
- [ ] Click "Deploy"
- [ ] Wait for deployment (1-2 min)
- [ ] Copy Vercel URL: `https://______________.vercel.app`

---

## Step 10: Add Frontend Environment Variables
- [ ] In Vercel, go to project Settings
- [ ] Click "Environment Variables"
- [ ] Add these:

Variables to add:
- [ ] **VITE_API_URL** = `https://your-railway-url.up.railway.app`
- [ ] **VITE_RAZORPAY_KEY_ID** = `your_razorpay_key`
- [ ] **VITE_GA_MEASUREMENT_ID** = `G-XXXXXXXXXX` (optional)

- [ ] Click "Redeploy" to apply variables

---

## Step 11: Connect Backend and Frontend
- [ ] Go back to Railway
- [ ] Click backend service → "Variables" tab
- [ ] Find "FRONTEND_URL" variable
- [ ] Click "Edit"
- [ ] Change to: `https://your-vercel-url.vercel.app`
- [ ] Save (Railway will auto-redeploy)

---

## Step 12: Final Testing
- [ ] Visit your Vercel URL
- [ ] Test: Homepage loads
- [ ] Test: Click "Register" and create account
- [ ] Test: Login with new account
- [ ] Test: Browse properties
- [ ] Open browser console (F12) - check for errors
- [ ] Test: Try listing a property (if applicable)

**All working?** 🎉 **DEPLOYMENT COMPLETE!**

---

## 🆘 Troubleshooting Checklist

If something doesn't work:

**Backend Issues:**
- [ ] Check Railway deployment logs for errors
- [ ] Verify all environment variables are set
- [ ] Test health endpoint: /health
- [ ] Check Builder is set to DOCKERFILE
- [ ] Check Root Directory is "backend"

**Frontend Issues:**
- [ ] Check Vercel deployment logs
- [ ] Verify VITE_API_URL matches Railway URL exactly
- [ ] Check browser console (F12) for errors
- [ ] Clear browser cache and retry

**CORS Errors:**
- [ ] Verify FRONTEND_URL in Railway matches Vercel URL exactly
- [ ] Include https:// in both URLs
- [ ] No trailing slash in URLs
- [ ] Redeploy backend after changing FRONTEND_URL

**Database Errors:**
- [ ] Verify PostgreSQL is added in Railway
- [ ] Check DATABASE_URL variable exists
- [ ] Check backend logs for connection errors

---

## 📊 Quick Reference

**Your URLs:**
- Railway Backend: `https://________________.up.railway.app`
- Vercel Frontend: `https://________________.vercel.app`

**Important Accounts:**
- Railway: https://railway.app
- Vercel: https://vercel.com
- Razorpay: https://dashboard.razorpay.com
- Google Analytics: https://analytics.google.com

---

## 🎯 Current Step

**Where you are:** Step 1 - Logging into Railway

**Next action:** Open browser → Go to https://railway.app → Login with GitHub

---

Good luck! Check off items as you go. 🚀
