# 🏗️ Real Estate Portal - Complete Implementation

A comprehensive real estate portal with multi-branch admin system, property listings, service bookings, and advanced features similar to MagicBricks.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## ✨ Features

### Core Features
- ✅ **Property Management**
  - Property CRUD operations
  - Multi-level approval workflow (Seller → Branch Admin → Super Admin)
  - SV Verified badge system
  - Advanced search with cascading filters (Region → Location → Budget → Property Type)
  - Owner-only filter

- ✅ **Multi-Branch Admin System**
  - Branch Admin: Regional control, limited access
  - Super Admin: Global control, full access
  - Branch-wise data isolation
  - Branch-specific reports

- ✅ **Service Booking Modules**
  - **Survey Support**: 6 types (Digital, Land, DTCP, House, Commercial, Industrial)
  - **Legal Support**: Documentation, Legal Advice
  - **Construction Support**: 7 services (2D/3D Plans, Elevation, Plan Approval, Vastu, Walk-through, Interior, Construction)
  - **Finance Support**: EMI Calculator, Bank Tie-ups, Home/Plot Loans

- ✅ **Payment Gateway**
  - Razorpay integration
  - Secure payment processing
  - Transaction history
  - Refund management

- ✅ **Leads & Site Visits**
  - Lead tracking system
  - Site visit scheduling
  - Status management
  - Branch-wise filtering

- ✅ **Real-time Chat**
  - Socket.io implementation
  - Property-based conversations
  - Unread message tracking

- ✅ **Reports & Analytics**
  - Branch-wise reports (leads, site visits, bookings)
  - Global reports (revenue, conversions)
  - Dashboard statistics

- ✅ **Offers & News**
  - Promotional offers
  - News updates
  - Validity management

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL (v14+)
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + AWS S3
- **Payment**: Razorpay
- **Real-time**: Socket.io
- **Validation**: express-validator

### Frontend (To be implemented)
- **Framework**: React 18+
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **UI Library**: Ant Design / Material-UI
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client

---

## 📁 Project Structure

```
real-estate-portal/
├── backend/
│   ├── config/
│   │   └── database.js           # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── propertyController.js # Property CRUD
│   │   ├── approvalController.js # Approval workflow
│   │   ├── serviceController.js  # Service bookings
│   │   ├── paymentController.js  # Razorpay integration
│   │   ├── leadController.js     # Leads & site visits
│   │   ├── adminController.js    # Admin dashboards
│   │   ├── chatController.js     # Real-time chat
│   │   ├── offersNewsController.js
│   │   └── reportController.js   # Reports & analytics
│   ├── middleware/
│   │   ├── auth.js               # JWT & role-based auth
│   │   ├── errorHandler.js       # Error handling
│   │   └── upload.js             # File upload
│   ├── models/
│   │   ├── index.js              # Model associations
│   │   ├── User.js
│   │   ├── Branch.js
│   │   ├── Property.js
│   │   ├── PropertyImage.js
│   │   ├── Approval.js
│   │   ├── ServiceBooking.js
│   │   ├── SurveyBooking.js
│   │   ├── LegalBooking.js
│   │   ├── ConstructionBooking.js
│   │   ├── FinanceBooking.js
│   │   ├── Payment.js
│   │   ├── Lead.js
│   │   ├── SiteVisit.js
│   │   ├── Chat.js
│   │   ├── Message.js
│   │   └── OfferNews.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── branchRoutes.js
│   │   ├── branchAdminRoutes.js
│   │   ├── superAdminRoutes.js
│   │   ├── surveyRoutes.js
│   │   ├── legalRoutes.js
│   │   ├── constructionRoutes.js
│   │   ├── financeRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── leadRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── offersNewsRoutes.js
│   │   └── chatRoutes.js
│   ├── services/              # Business logic services
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/                  # React app (to be implemented)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Git

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd real-estate-portal
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

### Step 3: Database Setup
1. Create PostgreSQL database:
```sql
CREATE DATABASE real_estate_portal;
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=real_estate_portal
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

# Razorpay
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret

# AWS S3 (for image uploads)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=ap-south-1
```

### Step 4: Run Migrations
The application uses Sequelize with `alter: true`, so tables will be created/updated automatically on first run.

### Step 5: Create Super Admin
After starting the server, create a super admin user:
```bash
POST /api/auth/register
{
  "name": "Super Admin",
  "email": "admin@propertyportal.com",
  "phone": "1234567890",
  "password": "Admin@123456",
  "role": "super_admin"
}
```

---

## ⚙️ Configuration

### Environment Variables

#### Required Variables
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_NAME=real_estate_portal
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
```

#### Optional Variables
```env
# Email (SendGrid)
SENDGRID_API_KEY=SG.xxx
FROM_EMAIL=noreply@propertyportal.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx

# Redis (for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 🏃 Running the Application

### Development Mode
```bash
# Backend
cd backend
npm run dev

# Frontend (when implemented)
cd frontend
npm run dev
```

### Production Mode
```bash
cd backend
npm start
```

Server will run on: `http://localhost:5000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### API Endpoints

#### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login
GET    /api/auth/me                - Get current user
POST   /api/auth/logout            - Logout
POST   /api/auth/forgot-password   - Forgot password
POST   /api/auth/reset-password    - Reset password
```

#### Properties
```
GET    /api/properties                    - Get all properties
GET    /api/properties/:id                - Get single property
POST   /api/properties                    - Create property
PUT    /api/properties/:id                - Update property
DELETE /api/properties/:id                - Delete property
GET    /api/properties/search/locations/:region  - Get locations by region
POST   /api/properties/:id/increment-view - Increment views
```

#### Branch Admin
```
GET    /api/branch-admin/dashboard           - Dashboard stats
GET    /api/branch-admin/properties/pending  - Pending approvals
POST   /api/branch-admin/properties/:id/approve - Approve property
POST   /api/branch-admin/properties/:id/reject  - Reject property
GET    /api/branch-admin/users              - Branch users
```

#### Super Admin
```
GET    /api/super-admin/dashboard            - Global dashboard
GET    /api/super-admin/properties/pending   - Final approval queue
POST   /api/super-admin/properties/:id/approve - Final approval
POST   /api/super-admin/properties/:id/reject  - Reject property
POST   /api/super-admin/properties/:id/sv-verify - SV verification
POST   /api/super-admin/branches            - Create branch
POST   /api/super-admin/branch-admins       - Create branch admin
```

#### Services
```
POST   /api/services/survey/book            - Book survey
POST   /api/services/legal/book             - Book legal service
POST   /api/services/construction/book      - Book construction
POST   /api/services/finance/enquiry        - Submit loan enquiry
POST   /api/services/finance/calculate-emi  - Calculate EMI
GET    /api/services/finance/banks          - Get bank tie-ups
```

#### Payments
```
POST   /api/payments/create-order           - Create Razorpay order
POST   /api/payments/verify                 - Verify payment
GET    /api/payments/transactions           - User transactions
```

#### Leads & Site Visits
```
POST   /api/leads                           - Create lead
GET    /api/leads                           - Get leads
PUT    /api/leads/:id                       - Update lead
POST   /api/leads/:id/site-visit            - Schedule site visit
GET    /api/leads/site-visits               - Get site visits
PUT    /api/leads/site-visits/:id           - Update site visit
```

#### Reports
```
GET    /api/reports/branch/leads            - Branch leads report
GET    /api/reports/branch/site-visits      - Branch site visits
GET    /api/reports/branch/bookings         - Branch bookings
GET    /api/reports/global/leads            - Global leads
GET    /api/reports/global/revenue          - Revenue report
GET    /api/reports/global/bookings         - Overall bookings
```

#### Chat
```
POST   /api/chat/start                      - Start conversation
GET    /api/chat/conversations              - Get user conversations
GET    /api/chat/:chatId/messages           - Get messages
POST   /api/chat/:chatId/message            - Send message
```

#### Offers & News
```
GET    /api/offers-news                     - Get all offers/news
GET    /api/offers-news/:id                 - Get single item
POST   /api/offers-news                     - Create (admin)
PUT    /api/offers-news/:id                 - Update (admin)
DELETE /api/offers-news/:id                 - Delete (admin)
```

---

## 🗄️ Database Schema

### Key Tables
- **users**: User accounts with roles
- **branches**: Branch information
- **properties**: Property listings
- **property_images**: Property images
- **approvals**: Approval workflow history
- **service_bookings**: Main service bookings table
- **survey_bookings**: Survey-specific details
- **legal_bookings**: Legal service details
- **construction_bookings**: Construction project details
- **finance_bookings**: Loan applications
- **payments**: Payment transactions
- **leads**: Lead management
- **site_visits**: Site visit scheduling
- **chats**: Chat conversations
- **messages**: Chat messages
- **offers_news**: Offers and news items

---

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)

1. **Set environment variables** in your hosting platform
2. **Update database connection** to use production credentials
3. **Deploy**:
```bash
git push heroku main
```

### Frontend Deployment (Vercel)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy to Vercel:
```bash
vercel --prod
```

### Database (AWS RDS)
1. Create PostgreSQL instance on AWS RDS
2. Update `DB_HOST` in environment variables
3. Ensure security groups allow connections

---

## 📝 Testing

### Manual Testing
Use Postman or Thunder Client to test API endpoints.

Import the provided Postman collection (if available).

### Sample Requests

**Register User:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "Password@123"
}
```

**Create Property:**
```json
POST /api/properties
Authorization: Bearer <token>
{
  "title": "3 BHK Apartment in Coimbatore",
  "description": "Spacious apartment near RS Puram",
  "property_type": "house",
  "price": 5000000,
  "area": 1500,
  "area_unit": "sqft",
  "bedrooms": 3,
  "bathrooms": 2,
  "address": "RS Puram, Coimbatore",
  "region": "coimbatore",
  "location": "RS Puram",
  "city": "Coimbatore",
  "pincode": "641002"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👥 Support

For support, email: support@propertyportal.com

---

## 🎯 Roadmap

### Phase 1 (Completed ✅)
- Backend API implementation
- Database schema
- Authentication system
- Admin dashboards
- Service booking modules
- Payment integration

### Phase 2 (In Progress)
- Frontend React application
- Property listing pages
- Admin dashboards UI
- Service booking forms

### Phase 3 (Upcoming)
- Mobile app (React Native)
- Advanced analytics
- Email notifications
- SMS notifications
- WhatsApp integration

---

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify credentials
psql -U your_user -d real_estate_portal
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### JWT Token Errors
- Ensure `JWT_SECRET` is set in `.env`
- Check token expiry (default: 7 days)

---

**Built with ❤️ for modern real estate management**
