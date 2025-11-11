# 🚀 COMPLETE SETUP GUIDE
## Real Estate Portal - Step-by-Step Installation

**Time Required:** 30-45 minutes  
**Skill Level:** Intermediate

---

## ✅ PREREQUISITES

Before you start, ensure you have:

### **Required Software:**
```bash
✓ Node.js 18+ (Download: https://nodejs.org/)
✓ PostgreSQL 14+ (Download: https://www.postgresql.org/)
✓ Git (Download: https://git-scm.com/)
✓ Code Editor (VS Code recommended)
```

### **Check Installations:**
```bash
node --version    # Should show v18 or higher
npm --version     # Should show 9 or higher
psql --version    # Should show 14 or higher
```

---

## 📦 STEP 1: PROJECT SETUP

### **Download the Project**
```bash
# If you have the zip file
unzip real-estate-portal.zip
cd real-estate-portal

# OR if you have it from Claude
# Just navigate to the folder
cd real-estate-portal
```

### **Project Structure Check**
```
real-estate-portal/
├── frontend/          ✓ React app
├── backend/           ✓ Node.js API
└── README.md          ✓ This file
```

---

## 🗄️ STEP 2: DATABASE SETUP

### **2.1 Create Database**

**On macOS/Linux:**
```bash
# Start PostgreSQL
sudo service postgresql start

# Create database
createdb real_estate_portal

# Verify
psql -l | grep real_estate
```

**On Windows:**
```cmd
# Open SQL Shell (psql) from Start Menu
# Then run:
CREATE DATABASE real_estate_portal;

# Verify
\l
```

### **2.2 Create Database Tables**

```bash
cd backend

# Method 1: Using provided SQL file (if you have it)
psql -U postgres -d real_estate_portal -f database/schema.sql

# Method 2: Using Sequelize CLI
npm install -g sequelize-cli
sequelize db:migrate
```

### **2.3 Seed Sample Data (Optional)**
```bash
sequelize db:seed:all
```

---

## 🔧 STEP 3: BACKEND SETUP

### **3.1 Install Dependencies**
```bash
cd backend
npm install
```

This will install:
- Express (Web framework)
- PostgreSQL driver
- JWT for authentication
- Socket.io for real-time
- Razorpay SDK
- And 20+ other packages

**Installation time:** 2-3 minutes

### **3.2 Configure Environment Variables**
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values
nano .env
# OR use your code editor
```

**Minimum Required Configuration:**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/real_estate_portal
JWT_SECRET=your_secret_key_at_least_32_characters_long
FRONTEND_URL=http://localhost:3000
```

### **3.3 Test Backend**
```bash
npm run dev
```

**Expected Output:**
```
================================================
🚀 Server running on port 5000
📡 API: http://localhost:5000
🔌 Socket.io: Ready
🌍 Environment: development
✅ Database connection established successfully.
================================================
```

**Test API:**
Open browser: `http://localhost:5000`

Should show:
```json
{
  "message": "Real Estate Portal API",
  "version": "1.0.0",
  "status": "Running"
}
```

✅ **Backend is running!**

---

## ⚛️ STEP 4: FRONTEND SETUP

**Open a NEW terminal** (keep backend running)

### **4.1 Install Dependencies**
```bash
cd frontend
npm install
```

This will install:
- React 18
- Redux Toolkit
- Ant Design
- React Router
- And 15+ other packages

**Installation time:** 3-5 minutes

### **4.2 Configure Environment**
```bash
# Copy the example file
cp .env.example .env

# Edit if needed (defaults work for local)
nano .env
```

**Default Configuration (works locally):**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### **4.3 Start Frontend**
```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

Browser should automatically open to `http://localhost:3000`

✅ **Frontend is running!**

---

## 🎉 STEP 5: VERIFY INSTALLATION

### **5.1 Check Both Servers**

**Terminal 1 - Backend:**
```
Server running on port 5000 ✓
```

**Terminal 2 - Frontend:**
```
Compiled successfully! ✓
```

### **5.2 Test the Application**

**Open:** `http://localhost:3000`

You should see:
- ✅ Homepage loads
- ✅ Navigation menu
- ✅ Search bar
- ✅ No errors in console

### **5.3 Test API Connection**

1. Click "Login" button
2. Try to login (even with fake credentials)
3. Check browser Network tab
4. Should see API call to `http://localhost:5000/api/auth/login`

✅ **Frontend ↔ Backend communication working!**

---

## 🛠️ COMMON ISSUES & SOLUTIONS

### **Issue 1: Port Already in Use**

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find and kill the process
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### **Issue 2: Database Connection Error**

**Error:** `Unable to connect to database`

**Solutions:**
```bash
# 1. Check PostgreSQL is running
sudo service postgresql status

# 2. Verify credentials
psql -U postgres

# 3. Check DATABASE_URL in .env matches your setup
# Format: postgresql://username:password@localhost:5432/dbname
```

### **Issue 3: Module Not Found**

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Issue 4: CORS Error**

**Error:** `Access blocked by CORS policy`

**Solution:**
Check backend `.env`:
```env
FRONTEND_URL=http://localhost:3000
```

And restart backend server.

---

## 📝 STEP 6: CREATE ADMIN ACCOUNT

### **6.1 Register First User**

1. Go to: `http://localhost:3000/register`
2. Fill in details
3. Select role: `Buyer` (for testing)
4. Click Register

### **6.2 Create Admin Users (via Database)**

```bash
# Connect to database
psql -U postgres -d real_estate_portal

# Make a user Super Admin
UPDATE users 
SET role = 'super_admin' 
WHERE email = 'youremail@example.com';

# Verify
SELECT id, name, email, role FROM users;

# Exit
\q
```

Now you can login as Super Admin!

---

## 🧪 STEP 7: TEST KEY FEATURES

### **Test Checklist:**

```
□ User Registration
□ User Login
□ View Properties
□ Search Properties
□ Post Property (as Seller)
□ View Dashboard
□ Admin Dashboard (as Admin)
□ Service Booking
□ Chat Feature
```

---

## 🚀 STEP 8: NEXT STEPS

### **For Development:**

1. **Read Documentation:**
   - API docs: `backend/docs/API.md`
   - Component docs: `frontend/docs/COMPONENTS.md`

2. **Customize:**
   - Change colors: `frontend/src/styles/global.css`
   - Modify API: `backend/src/routes/`
   - Add features: Follow existing patterns

3. **Testing:**
   ```bash
   # Frontend tests
   cd frontend
   npm test

   # Backend tests
   cd backend
   npm test
   ```

### **For Production Deployment:**

See: `DEPLOYMENT_GUIDE.md`

---

## 📞 GETTING HELP

### **Logs to Check:**

**Backend Logs:**
```bash
cd backend
npm run dev
# Watch the terminal for errors
```

**Frontend Logs:**
```bash
# Browser Console (F12)
# Look for red errors
```

### **Debug Mode:**

**Backend:**
```bash
NODE_ENV=development DEBUG=* npm run dev
```

**Frontend:**
```bash
# Already shows errors in browser console
```

---

## ✅ SUCCESS CHECKLIST

Before moving forward, ensure:

- [ ] ✅ PostgreSQL installed and running
- [ ] ✅ Database created: `real_estate_portal`
- [ ] ✅ Backend dependencies installed
- [ ] ✅ Backend .env configured
- [ ] ✅ Backend running on port 5000
- [ ] ✅ Frontend dependencies installed
- [ ] ✅ Frontend .env configured
- [ ] ✅ Frontend running on port 3000
- [ ] ✅ Homepage loads without errors
- [ ] ✅ Can register new user
- [ ] ✅ Can login
- [ ] ✅ API calls working

---

## 🎊 CONGRATULATIONS!

Your Real Estate Portal is now running!

**What you have:**
- ✅ Complete React frontend
- ✅ Node.js backend API
- ✅ PostgreSQL database
- ✅ User authentication
- ✅ Multi-branch admin system
- ✅ Service booking system
- ✅ Real-time chat ready
- ✅ Payment gateway ready

**Access your application:**
- 🌐 Frontend: http://localhost:3000
- 📡 Backend API: http://localhost:5000
- 🗄️ Database: postgresql://localhost:5432

---

## 📚 QUICK COMMANDS REFERENCE

```bash
# Start Backend
cd backend && npm run dev

# Start Frontend
cd frontend && npm start

# Stop Servers
Ctrl + C (in both terminals)

# Restart Everything
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start

# Database Access
psql -U postgres -d real_estate_portal

# View Logs
# Just watch your terminals!
```

---

## 🔄 DEVELOPMENT WORKFLOW

### **Daily Workflow:**

1. **Start Day:**
   ```bash
   # Start PostgreSQL
   sudo service postgresql start
   
   # Start Backend
   cd backend && npm run dev
   
   # Start Frontend (new terminal)
   cd frontend && npm start
   ```

2. **Make Changes:**
   - Edit files in `frontend/src/` or `backend/src/`
   - Servers auto-reload on save

3. **Test Changes:**
   - View in browser
   - Check console for errors
   - Test functionality

4. **End Day:**
   - Commit changes to Git
   - Stop servers (Ctrl + C)

---

## 🎯 WHAT TO BUILD NEXT

**Suggested Development Order:**

**Week 1: Core Features**
- [ ] Complete authentication pages
- [ ] Property listing page
- [ ] Property detail page
- [ ] Basic search

**Week 2: Seller Features**
- [ ] Post property form
- [ ] Seller dashboard
- [ ] Image upload
- [ ] Property management

**Week 3: Admin Features**
- [ ] Branch admin dashboard
- [ ] Approval queue
- [ ] Super admin dashboard
- [ ] SV verification

**Week 4: Services**
- [ ] Survey booking
- [ ] Legal services
- [ ] Construction services
- [ ] Finance services
- [ ] Payment integration

---

## 🆘 EMERGENCY TROUBLESHOOTING

### **Nothing Works!**

1. **Restart Everything:**
   ```bash
   # Kill all Node processes
   killall node
   
   # Restart PostgreSQL
   sudo service postgresql restart
   
   # Start fresh
   cd backend && npm run dev
   cd frontend && npm start
   ```

2. **Clean Install:**
   ```bash
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   
   # Frontend
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Database Reset:**
   ```bash
   dropdb real_estate_portal
   createdb real_estate_portal
   cd backend
   sequelize db:migrate
   ```

---

**🎉 Happy Coding! You're all set to build an amazing real estate portal!**

---

*Last Updated: November 2025*  
*Version: 1.0*  
*Status: Complete ✅*
