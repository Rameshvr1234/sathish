# 🚀 Quick Start Guide - Real Estate Portal

Get your Real Estate Portal up and running in 10 minutes!

## 📋 Prerequisites

Before you begin, ensure you have:
- ✅ Node.js v18+ installed
- ✅ PostgreSQL v14+ installed and running
- ✅ Git installed
- ✅ A code editor (VS Code recommended)

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Clone & Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd real-estate-portal

# Install backend dependencies
cd backend
npm install
```

### Step 2: Setup Database & Environment

```bash
# Create PostgreSQL database
createdb real_estate_portal

# Or using psql
psql -U postgres
CREATE DATABASE real_estate_portal;
\q

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

**Minimum Required Environment Variables:**
```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=real_estate_portal
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_very_long_secret_key_minimum_32_characters_long

RAZORPAY_KEY_ID=rzp_test_demo
RAZORPAY_KEY_SECRET=demo_secret

FRONTEND_URL=http://localhost:5173
```

### Step 3: Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

You should see:
```
✓ Database connection established successfully
✓ Database models synchronized
✓ Server running on port 5000 in development mode
✓ API URL: http://localhost:5000
```

---

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-XX..."
}
```

### Create Super Admin

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "admin@propertyportal.com",
    "phone": "1234567890",
    "password": "Admin@123456",
    "role": "super_admin"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@propertyportal.com",
    "password": "Admin@123456"
  }'
```

Save the token from response!

---

## 📱 Using the API

### Create a Branch

```bash
curl -X POST http://localhost:5000/api/super-admin/branches \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Coimbatore Branch",
    "code": "CBE001",
    "region": "coimbatore",
    "address": "123 Main Street",
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "pincode": "641001",
    "phone": "9876543210",
    "email": "cbe@propertyportal.com"
  }'
```

### Create a Branch Admin

```bash
curl -X POST http://localhost:5000/api/super-admin/branch-admins \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Branch Admin",
    "email": "branchadmin@propertyportal.com",
    "phone": "9876543211",
    "password": "BranchAdmin@123",
    "branch_id": "BRANCH_ID_FROM_PREVIOUS_STEP"
  }'
```

### Register a Seller

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Seller",
    "email": "john@example.com",
    "phone": "9876543212",
    "password": "Seller@123",
    "role": "seller"
  }'
```

### Create a Property (as Seller)

```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Authorization: Bearer SELLER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "3 BHK Apartment in RS Puram",
    "description": "Spacious apartment with modern amenities",
    "property_type": "house",
    "listing_type": "sale",
    "price": 5000000,
    "area": 1500,
    "area_unit": "sqft",
    "bedrooms": 3,
    "bathrooms": 2,
    "address": "123 RS Puram Main Road",
    "region": "coimbatore",
    "location": "RS Puram",
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "pincode": "641002",
    "is_owner": true,
    "amenities": ["parking", "lift", "gym"],
    "features": {
      "furnishing": "Semi-Furnished",
      "facing": "East"
    }
  }'
```

---

## 🔄 Approval Workflow Test

### 1. Branch Admin Approves Property

```bash
curl -X POST http://localhost:5000/api/branch-admin/properties/PROPERTY_ID/approve \
  -H "Authorization: Bearer BRANCH_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "Property verified and approved by branch"
  }'
```

### 2. Super Admin Final Approval

```bash
curl -X POST http://localhost:5000/api/super-admin/properties/PROPERTY_ID/approve \
  -H "Authorization: Bearer SUPER_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "Final approval granted",
    "assignSvVerified": true
  }'
```

---

## 🧪 Service Booking Test

### Calculate EMI (Public)

```bash
curl -X POST http://localhost:5000/api/services/finance/calculate-emi \
  -H "Content-Type: application/json" \
  -d '{
    "loan_amount": 5000000,
    "tenure_months": 240,
    "interest_rate": 8.5
  }'
```

### Book Survey Service

```bash
curl -X POST http://localhost:5000/api/services/survey/book \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "service_sub_type": "land",
    "property_address": "Plot 123, ABC Layout, Coimbatore",
    "scheduled_date": "2025-02-01",
    "additional_details": "Please contact before visiting"
  }'
```

---

## 📊 Dashboard Access

### Branch Admin Dashboard

```bash
curl http://localhost:5000/api/branch-admin/dashboard \
  -H "Authorization: Bearer BRANCH_ADMIN_TOKEN"
```

### Super Admin Dashboard

```bash
curl http://localhost:5000/api/super-admin/dashboard \
  -H "Authorization: Bearer SUPER_ADMIN_TOKEN"
```

---

## 🐛 Common Issues & Solutions

### Issue: Database connection failed
**Solution:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if not running
sudo systemctl start postgresql
```

### Issue: Port 5000 already in use
**Solution:**
```bash
# Change PORT in .env file
PORT=5001

# Or kill the process using port 5000
lsof -ti:5000 | xargs kill -9
```

### Issue: JWT token invalid
**Solution:**
- Make sure `JWT_SECRET` in `.env` is at least 32 characters
- Token expires after 7 days by default
- Use a fresh token from login endpoint

### Issue: Cannot create tables
**Solution:**
```bash
# Drop and recreate database
dropdb real_estate_portal
createdb real_estate_portal

# Restart server (tables will be auto-created)
npm run dev
```

---

## 📚 Next Steps

1. ✅ **API is running!**
2. 📱 **Download Postman** and import API collection
3. 🎨 **Setup Frontend** (Coming soon)
4. 🚀 **Deploy to production**

---

## 📖 Full Documentation

For complete API documentation, see: [README_IMPLEMENTATION.md](./README_IMPLEMENTATION.md)

---

## 💡 Pro Tips

- Use **Postman** or **Thunder Client** for easier API testing
- Save your tokens in Postman environment variables
- Check `backend/server.js` logs for detailed error messages
- Use `npm run dev` for development (auto-reload on file changes)

---

## 🆘 Need Help?

- Check the full [README](./README_IMPLEMENTATION.md)
- Review API endpoints in `/backend/routes/`
- Check controller logic in `/backend/controllers/`

---

**Happy Coding! 🎉**
