# Railway Deployment Fix Guide

## Issue: "creating build plan with Railpack" Error

This error occurs when Railway can't detect how to build your project. Here are the solutions:

## Solution 1: Deploy from Root Directory (Recommended)

Instead of selecting the `backend` folder, deploy from the root directory and let Railway auto-detect.

### Steps:

1. **In Railway Dashboard:**
   - Delete the current deployment (if exists)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - **Important:** Don't specify a root directory
   - Let Railway deploy from the root

2. **Configure in Railway:**
   - Go to Settings → "Service Settings"
   - Set Root Directory: `backend`
   - Click "Save"

3. **Add Environment Variables:**
   - Click on "Variables" tab
   - Add all required variables (see below)

4. **Redeploy:**
   - Go to Deployments
   - Click "Redeploy"

## Solution 2: Use Railway CLI

If the dashboard doesn't work, use the CLI:

```bash
cd backend

# Initialize Railway project
railway init

# Link to PostgreSQL
railway add -d postgresql

# Set variables
railway variables set NODE_ENV=production
railway variables set PORT=5000

# Deploy
railway up
```

## Solution 3: Simplified Configuration

I've created multiple config files for Railway. Try removing all except one:

**Option A: Keep only `Procfile`**
```bash
cd backend
rm railway.json railway.toml nixpacks.toml
# Keep only Procfile
```

**Option B: Keep only `nixpacks.toml`**
```bash
cd backend
rm railway.json railway.toml Procfile
# Keep only nixpacks.toml
```

**Option C: Keep only `railway.toml`**
```bash
cd backend
rm railway.json nixpacks.toml Procfile
# Keep only railway.toml
```

Then commit and push, and redeploy on Railway.

## Solution 4: Manual Build Configuration in Railway Dashboard

1. Go to your Railway project
2. Click on Settings
3. Scroll to "Build & Deploy"
4. Set these manually:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Install Command:** `npm install`
   - **Watch Paths:** Leave empty or set to `backend/**`

5. Set Root Directory: `backend`
6. Click "Save"
7. Redeploy

## Solution 5: Use Dockerfile Instead

Railway can also use Docker. The Dockerfile is already configured:

1. In Railway project settings
2. Change "Builder" from "Nixpacks" to "Dockerfile"
3. Ensure Root Directory is `backend`
4. Redeploy

## Required Environment Variables for Railway

Add these in Railway Variables tab:

```env
NODE_ENV=production
PORT=5000

# Database (Auto-configured if using Railway PostgreSQL)
# DATABASE_URL is auto-set by Railway, but you can also set individual vars:
DB_HOST=${{PGHOST}}
DB_PORT=${{PGPORT}}
DB_NAME=${{PGDATABASE}}
DB_USER=${{PGUSER}}
DB_PASSWORD=${{PGPASSWORD}}

# Required
JWT_SECRET=<generate-random-32-char-string>
FRONTEND_URL=https://your-frontend.vercel.app

# Razorpay
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email@gmail.com>
EMAIL_PASSWORD=<your-app-password>

# Optional
AGORA_APP_ID=<your-agora-id>
AGORA_APP_CERTIFICATE=<your-agora-cert>
```

## Alternative: Deploy to Render.com Instead

If Railway continues to have issues, Render.com is a great alternative:

### Render Deployment:

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name:** real-estate-backend
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

6. Add Environment Variables (same as above)
7. Create "PostgreSQL" database from dashboard
8. Link database to web service
9. Deploy!

**Render URLs:**
- Backend: `https://your-app.onrender.com`
- PostgreSQL: Auto-configured

## Alternative: Deploy to Heroku

### Heroku Deployment:

```bash
# Install Heroku CLI
# On Ubuntu/Debian:
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
cd backend
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
# ... add all other variables

# Deploy
git subtree push --prefix backend heroku main
# Or if on a branch:
git push heroku claude/real-estate-portal-complete-011CV3wsLxf76Zb7qCmePaVW:main
```

## Troubleshooting Tips

### Check Logs:
- Railway: Click "Deployments" → Select deployment → "View Logs"
- Look for specific error messages

### Common Issues:

**1. "Module not found"**
- Ensure `package.json` is in the backend directory
- Check that all dependencies are listed
- Try setting Install Command to: `npm ci` or `npm install --legacy-peer-deps`

**2. "Port already in use"**
- Railway auto-assigns PORT
- Make sure your code uses: `process.env.PORT || 5000`
- Check server.js line where port is defined

**3. "Database connection failed"**
- Ensure PostgreSQL addon is added
- Check DATABASE_URL is set (Railway auto-sets this)
- Update config/database.js to use DATABASE_URL

**4. "Build timeout"**
- Increase timeout in Railway settings
- Or optimize package.json (remove unused dependencies)

### Verify Your Setup:

Check these files exist in `backend/`:
- [ ] package.json (with "start" script)
- [ ] server.js
- [ ] At least one of: Procfile, nixpacks.toml, railway.toml, or Dockerfile

## Quick Test Locally:

Before deploying, test locally:

```bash
cd backend
npm install
PORT=5000 NODE_ENV=production node server.js
```

Visit http://localhost:5000/health
Should return: `{"status":"OK","timestamp":"..."}`

## Need More Help?

If none of these solutions work:

1. Share the full error message from Railway logs
2. Share your Railway project settings (screenshot)
3. Try the Render.com alternative (often more reliable)
4. Use Docker deployment locally first to verify everything works

## Recommended Approach

**For fastest deployment with least issues:**

1. Use **Render.com** instead of Railway (more reliable for Node.js)
2. Or use **Docker** locally/VPS (you have full control)
3. Or use **Heroku** (proven platform, slightly more expensive)

Railway can sometimes be finicky with Nixpacks detection. The alternatives above are more battle-tested for Node.js applications.
