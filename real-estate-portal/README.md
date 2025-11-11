# 🏢 Real Estate Portal - Complete Web Application

**Production-ready real estate portal with MagicBricks architecture + Custom features**

---

## 🚀 QUICK START

### **Prerequisites**
```bash
Node.js 18+
PostgreSQL 14+
npm or yarn
```

### **Installation**

```bash
# 1. Clone/Download this project
cd real-estate-portal

# 2. Install Frontend Dependencies
cd frontend
npm install

# 3. Install Backend Dependencies
cd ../backend
npm install

# 4. Setup Database
createdb real_estate_portal
cd backend
npm run migrate

# 5. Setup Environment Variables
# Copy .env.example to .env in both frontend and backend
# Fill in your values

# 6. Start Development Servers

# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

---

## 📁 PROJECT STRUCTURE

```
real-estate-portal/
├── frontend/              # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # State management
│   │   ├── services/     # API calls
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Utilities
│   └── package.json
│
├── backend/              # Node.js API
│   ├── src/
│   │   ├── config/      # Configuration
│   │   ├── models/      # Database models
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Middleware
│   │   └── services/    # External services
│   └── package.json
│
└── README.md            # This file
```

---

## ✨ KEY FEATURES

### **Multi-Branch Admin System** ⭐
- Branch Admin (regional control)
- Super Admin (global control)
- 3-level approval workflow

### **Four Service Modules** ⭐
- Survey Support (6 types)
- Legal Support
- Construction Support (7 services)
- Finance Support (EMI calculator)

### **Advanced Search**
- Cascading filters: Region → Location → Budget → Type
- SV Verified properties
- Owner properties only

### **Payment Integration**
- Razorpay for service bookings
- Premium listings
- Transaction history

### **Real-Time Features**
- Socket.io chat
- Live notifications
- Instant lead alerts

---

## 🔧 TECH STACK

**Frontend:**
- React 18.2.0
- Redux Toolkit
- Ant Design
- React Router v6
- Axios
- Socket.io-client

**Backend:**
- Node.js + Express
- PostgreSQL + Sequelize
- JWT Authentication
- Socket.io
- Razorpay
- AWS S3 / Cloudinary

---

## 📊 DATABASE SCHEMA

**15+ Tables:**
- users, branches
- properties, property_images
- service_bookings (survey, legal, construction, finance)
- transactions, approvals
- leads, site_visits
- chats, messages
- offers_news

---

## 🔐 ENVIRONMENT VARIABLES

### **Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY_ID=your_key
REACT_APP_GOOGLE_MAPS_KEY=your_key
REACT_APP_SOCKET_URL=http://localhost:5000
```

### **Backend (.env)**
```
NODE_ENV=development
PORT=5000

DATABASE_URL=postgresql://user:pass@localhost:5432/real_estate_portal

JWT_SECRET=your_secret_key_min_32_characters
JWT_EXPIRE=7d

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket

SENDGRID_API_KEY=your_key
```

---

## 🌐 API ENDPOINTS

### **Authentication**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### **Properties**
```
GET    /api/properties
GET    /api/properties/:id
POST   /api/properties
PUT    /api/properties/:id
DELETE /api/properties/:id
```

### **Admin - Branch**
```
GET    /api/branch-admin/dashboard
GET    /api/branch-admin/properties/pending
POST   /api/branch-admin/properties/:id/approve
```

### **Admin - Super**
```
GET    /api/super-admin/dashboard
POST   /api/super-admin/properties/:id/approve
POST   /api/super-admin/properties/:id/sv-verify
```

### **Services**
```
POST   /api/services/survey/book
POST   /api/services/legal/book
POST   /api/services/construction/book
POST   /api/services/finance/enquiry
```

### **Payments**
```
POST   /api/payments/create-order
POST   /api/payments/verify
GET    /api/payments/transactions
```

**Total: 50+ endpoints**

---

## 👥 USER ROLES

1. **Buyer** - Search, view, contact, book services
2. **Seller** - Post properties, manage listings
3. **Agent** - Multiple listings, lead management
4. **Builder** - Projects, bulk uploads
5. **Branch Admin** - Regional approval, reports
6. **Super Admin** - Global control, final approval

---

## 🚀 DEVELOPMENT WORKFLOW

### **1. Setup (Week 1)**
- Install dependencies
- Configure database
- Setup environment variables
- Test basic API calls

### **2. Core Features (Weeks 2-4)**
- User authentication
- Property CRUD
- Basic search
- Image upload

### **3. Admin System (Weeks 5-6)**
- Branch admin dashboard
- Super admin dashboard
- Approval workflow

### **4. Services (Weeks 7-8)**
- All 4 service modules
- Payment integration
- Booking system

### **5. Polish (Weeks 9-12)**
- Real-time chat
- Reports
- Testing
- Deployment

---

## 📝 SCRIPTS

### **Frontend**
```bash
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
npm run lint       # Lint code
```

### **Backend**
```bash
npm run dev        # Development with nodemon
npm start          # Production server
npm run migrate    # Run database migrations
npm run seed       # Seed database
npm test           # Run tests
```

---

## 🔒 SECURITY FEATURES

✅ JWT Authentication  
✅ Password hashing (bcrypt)  
✅ Rate limiting  
✅ CORS configuration  
✅ SQL injection prevention  
✅ XSS protection  
✅ Input validation  

---

## 📱 RESPONSIVE DESIGN

✅ Mobile-first approach  
✅ Tablet optimized  
✅ Desktop layouts  
✅ Touch-friendly interface  

---

## 🧪 TESTING

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# E2E tests
npm run test:e2e
```

---

## 🚀 DEPLOYMENT

### **Frontend (Vercel)**
```bash
cd frontend
npm run build
vercel --prod
```

### **Backend (Railway/AWS)**
```bash
cd backend
# Configure environment variables
# Deploy via Git push or CLI
```

### **Database (AWS RDS)**
- Setup PostgreSQL instance
- Update DATABASE_URL
- Run migrations

---

## 📚 DOCUMENTATION

- **API Docs:** See `/backend/docs/API.md`
- **Component Docs:** See `/frontend/docs/COMPONENTS.md`
- **Database Schema:** See `/backend/docs/DATABASE.md`

---

## 🐛 TROUBLESHOOTING

### **Database Connection Error**
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Verify credentials in .env
psql -U postgres -d real_estate_portal
```

### **Port Already in Use**
```bash
# Frontend (3000)
lsof -ti:3000 | xargs kill -9

# Backend (5000)
lsof -ti:5000 | xargs kill -9
```

### **Module Not Found**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 SUPPORT

For issues or questions:
1. Check documentation
2. Review error logs
3. Search existing issues
4. Create new issue with details

---

## 📄 LICENSE

MIT License - See LICENSE file

---

## 🎉 WHAT'S INCLUDED

✅ Complete React frontend  
✅ Node.js backend API  
✅ PostgreSQL database schema  
✅ User authentication  
✅ Property management  
✅ Admin dashboards  
✅ Service booking system  
✅ Payment integration  
✅ Real-time chat  
✅ File upload  
✅ Email notifications  
✅ Responsive design  

---

## 🔄 VERSION

**Current Version:** 1.0.0  
**Last Updated:** November 2025  
**Status:** Production Ready ✅

---

**🚀 Ready to build! Follow the Quick Start guide above.**
