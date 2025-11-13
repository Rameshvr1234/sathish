# ✅ Quick Deployment Checklist

Follow these steps in order for a smooth deployment experience.

---

## Pre-Deployment Preparation (5 minutes)

### 1. Get Your Accounts Ready

- [ ] Sign up/login to **Railway**: https://railway.app/
  - Use your GitHub account for easy integration

- [ ] Sign up/login to **Vercel**: https://vercel.com/
  - Use your GitHub account for easy integration

- [ ] Get **Razorpay LIVE keys**: https://dashboard.razorpay.com/
  - Switch to "Live Mode" (toggle in top right)
  - Go to Settings → API Keys
  - Generate new Key ID and Secret
  - **Keep these secure!**

### 2. Generate Secrets

- [ ] Generate JWT Secret:
  ```bash
  # Run this on your local machine:
  openssl rand -base64 32
  # Copy the output - you'll need it for Railway
  ```

### 3. Prepare AWS S3 (Optional but Recommended)

- [ ] Create S3 bucket for property images
- [ ] Create IAM user with S3 permissions
- [ ] Get Access Key ID and Secret Access Key

---

## Part 1: Deploy Backend to Railway (10-15 minutes)

### Step 1: Create Project
- [ ] Go to https://railway.app/new
- [ ] Click "Deploy from GitHub repo"
- [ ] Select your repository: `Rameshvr1234/sathish`
- [ ] Set Root Directory: `/backend`
- [ ] Click "Deploy"

### Step 2: Add PostgreSQL Database
- [ ] In your Railway project, click "+ New"
- [ ] Select "Database" → "PostgreSQL"
- [ ] Wait for provisioning (1-2 minutes)

### Step 3: Configure Environment Variables
- [ ] Click on your backend service
- [ ] Go to "Variables" tab
- [ ] Click "RAW Editor"
- [ ] Copy contents from `RAILWAY_ENV_TEMPLATE.txt`
- [ ] Update with your actual values:
  - [ ] JWT_SECRET (from Step 2 of Pre-Deployment)
  - [ ] RAZORPAY_KEY_ID (live key)
  - [ ] RAZORPAY_KEY_SECRET (live secret)
  - [ ] AWS credentials (if using S3)
- [ ] Click "Save"

### Step 4: Deploy and Verify
- [ ] Railway will auto-deploy
- [ ] Wait for deployment (3-5 minutes)
- [ ] Check "Deployments" tab - should show "Success"
- [ ] Go to "Settings" → "Networking" → "Generate Domain"
- [ ] Copy your backend URL (e.g., `https://your-app.railway.app`)
- [ ] Test it: `curl https://your-backend.railway.app/health`
  - Should return: `{"success":true,"message":"Server is running"}`

### Step 5: Run Migrations

**Option A: Via Railway Dashboard**
- [ ] Go to your backend service
- [ ] Click "Settings" tab
- [ ] Look for deployment logs
- [ ] Migrations should run automatically

**Option B: Via Railway CLI (if Option A doesn't work)**
```bash
# On your local machine:
npm install -g @railway/cli
railway login
railway link  # Select your project
cd backend
railway run npm run migrate
```

---

## Part 2: Deploy Frontend to Vercel (10 minutes)

### Step 1: Create Project
- [ ] Go to https://vercel.com/new
- [ ] Click "Import Project"
- [ ] Select your repository: `Rameshvr1234/sathish`
- [ ] Configure:
  - Framework Preset: **Vite**
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`

### Step 2: Set Environment Variables
- [ ] In project settings, go to "Environment Variables"
- [ ] Add `VITE_API_URL`:
  - Value: `https://your-backend.railway.app/api`
  - **IMPORTANT**: Replace with YOUR Railway backend URL and add `/api` at the end!
- [ ] Add `VITE_RAZORPAY_KEY_ID`:
  - Value: Your Razorpay LIVE Key ID (same as in Railway)

### Step 3: Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Copy your frontend URL (e.g., `https://your-app.vercel.app`)

### Step 4: Test Frontend
- [ ] Open your Vercel URL in browser
- [ ] You should see the Real Estate Portal home page
- [ ] Open browser console (F12) - check for errors
- [ ] Try to register a new user
- [ ] Try to login

---

## Part 3: Connect Frontend and Backend (5 minutes)

### Update CORS in Railway
- [ ] Go back to Railway dashboard
- [ ] Click on your backend service
- [ ] Go to "Variables" tab
- [ ] Find `FRONTEND_URL` variable
- [ ] Update value to your Vercel URL: `https://your-app.vercel.app`
- [ ] Railway will auto-redeploy (2-3 minutes)

### Verify Connection
- [ ] Open your frontend in browser
- [ ] Open browser console (F12)
- [ ] Try to login
- [ ] Should NOT see any CORS errors
- [ ] Test all features:
  - [ ] User registration
  - [ ] User login
  - [ ] Browse properties
  - [ ] View property details
  - [ ] Post new property (if seller)
  - [ ] Book a service
  - [ ] Save a property
  - [ ] Chat (if available)

---

## Part 4: Update Mobile App (5 minutes)

### Update Environment
- [ ] On your local machine:
  ```bash
  cd mobile
  nano .env
  ```
- [ ] Update these values:
  ```env
  API_URL=https://your-backend.railway.app/api
  RAZORPAY_KEY_ID=rzp_live_your_key_id
  ```
- [ ] Save and exit

### Test Mobile App
- [ ] Start Metro bundler: `npm start`
- [ ] Run on Android: `npm run android`
  - Or iOS: `npm run ios`
- [ ] Test login and registration
- [ ] Verify it connects to production backend

---

## Part 5: Final Verification (10 minutes)

### Backend Health Check
- [ ] `curl https://your-backend.railway.app/health`
- [ ] Should return success status

### Frontend Verification
- [ ] Home page loads correctly
- [ ] Properties list loads
- [ ] Images display properly
- [ ] All navigation works

### Database Verification
- [ ] Go to Railway → PostgreSQL service
- [ ] Click "Connect" to see connection details
- [ ] Verify tables exist (optional - use a DB client)

### Security Check
- [ ] Verify using LIVE Razorpay keys (not test keys)
- [ ] Verify JWT_SECRET is strong and unique
- [ ] Check that sensitive data is not exposed in frontend

### Performance Check
- [ ] Test page load times
- [ ] Test API response times
- [ ] Check Railway metrics for usage

---

## Part 6: Optional Enhancements

### Add Custom Domain
- [ ] **Vercel**: Settings → Domains → Add Domain
- [ ] **Railway**: Settings → Domains → Add Custom Domain
- [ ] Update DNS records as instructed
- [ ] Update `FRONTEND_URL` in Railway with custom domain

### Setup Error Monitoring
- [ ] Sign up for Sentry: https://sentry.io
- [ ] Add Sentry DSN to environment variables
- [ ] Test error tracking

### Enable Database Backups
- [ ] Railway: PostgreSQL service → Settings → Backups
- [ ] Enable automatic daily backups

### Setup CI/CD
- [ ] Both Railway and Vercel auto-deploy on git push
- [ ] Or configure GitHub Actions (files already in `.github/workflows/`)

---

## Common Issues and Quick Fixes

### ❌ Backend deployment fails
- **Solution**: Check Railway logs for error details
- Verify all required environment variables are set
- Check database connection

### ❌ Frontend shows CORS error
- **Solution**:
  1. Verify `FRONTEND_URL` in Railway matches your Vercel URL exactly
  2. Wait 2-3 minutes for Railway to redeploy
  3. Clear browser cache and reload

### ❌ Database connection fails
- **Solution**: Verify PostgreSQL service is running in Railway
- Check `DATABASE_URL` or individual DB variables are set correctly

### ❌ API calls return 404
- **Solution**: Verify `VITE_API_URL` has `/api` at the end
- Should be: `https://your-backend.railway.app/api` (not just `/`)

### ❌ Images not uploading
- **Solution**: If not using S3, images are stored in memory
- For production, setup AWS S3 and add credentials

### ❌ Payments not working
- **Solution**: Verify using LIVE Razorpay keys (not test keys)
- Check Razorpay dashboard for webhook errors

---

## Success Criteria ✅

You've successfully deployed when:

- ✅ Backend health check returns success
- ✅ Frontend loads and displays home page
- ✅ User can register new account
- ✅ User can login successfully
- ✅ Properties list displays correctly
- ✅ Property details page works
- ✅ Sellers can post new properties
- ✅ Service booking works
- ✅ No CORS errors in browser console
- ✅ Mobile app connects to production backend

---

## Estimated Total Time: 45-60 minutes

**Breakdown:**
- Pre-Deployment: 5 min
- Backend Deployment: 15 min
- Frontend Deployment: 10 min
- Connect & Configure: 5 min
- Mobile Update: 5 min
- Testing & Verification: 10 min
- Optional Enhancements: 10 min

---

## Next Steps After Deployment

1. **Monitor Your App**
   - Check Railway metrics daily
   - Monitor error rates
   - Track database usage

2. **Populate with Real Data**
   - Add actual properties
   - Test with real users
   - Gather feedback

3. **Marketing & Launch**
   - Announce on social media
   - Share with potential users
   - Collect testimonials

4. **Mobile App Distribution**
   - Build production APK for Android
   - Build production IPA for iOS
   - Submit to Play Store and App Store

5. **Ongoing Maintenance**
   - Regular backups
   - Security updates
   - Feature additions based on feedback

---

## Support Resources

- **Railway Docs**: https://docs.railway.app/
- **Vercel Docs**: https://vercel.com/docs
- **React Native Docs**: https://reactnative.dev/docs/getting-started

---

**Good luck with your deployment! 🚀**

**Your Real Estate Portal is ready to serve thousands of users!**
