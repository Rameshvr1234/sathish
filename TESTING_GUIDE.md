# 🧪 Complete Testing Guide

## Table of Contents
1. [Manual Testing](#manual-testing)
2. [API Testing with Postman](#api-testing)
3. [Automated Testing](#automated-testing)
4. [End-to-End Testing](#e2e-testing)
5. [Performance Testing](#performance-testing)

---

## 1. Manual Testing

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- PostgreSQL database created
- Environment variables configured

### Test Checklist

#### ✅ Authentication Flow
```
□ Register new user as "user"
□ Register new user as "seller"
□ Login with registered credentials
□ Verify JWT token is stored in localStorage
□ Verify user info appears in header
□ Logout and verify token is removed
□ Try accessing protected routes when logged out
□ Test "forgot password" flow
```

#### ✅ Property Management
```
□ View property listing page
□ Test cascading filters:
  - Select region (Coimbatore)
  - Verify locations are populated
  - Select a location
  - Adjust budget slider
  - Check property type filters
  - Toggle SV Verified filter
  - Toggle Owner Only filter
□ Click on a property card
□ View property details
□ Click "Contact Owner" button
□ Create new property (as seller)
□ View "My Properties"
□ Verify property status
```

#### ✅ Service Bookings
```
□ Navigate to Survey service
□ Select service type (e.g., Land Survey)
□ Fill in property address
□ Submit booking
□ Check "My Bookings" page
□ Repeat for Legal service
□ Repeat for Construction service
□ Test EMI calculator (Finance)
□ Submit loan enquiry
```

#### ✅ Admin Workflows
```
Branch Admin:
□ Login as branch admin
□ View branch dashboard
□ Check pending approvals
□ Approve a property
□ Reject a property with reason
□ View branch reports

Super Admin:
□ Login as super admin
□ View super admin dashboard
□ Check pending super approvals
□ Give final approval
□ Assign SV Verified badge
□ Create new branch
□ Create branch admin
□ View global reports
```

#### ✅ Chat System
```
□ Login as buyer
□ Navigate to property detail
□ Start chat with seller
□ Send message
□ Login as seller (different browser)
□ Check for new message
□ Reply to message
□ Verify real-time delivery
```

---

## 2. API Testing with Postman

### Setup Postman Collection

Create a new collection: "Real Estate Portal API"

### Environment Variables
```
base_url: http://localhost:5000/api
token: (will be set after login)
user_id: (will be set after login)
property_id: (for testing)
```

### Test Scenarios

#### Authentication Tests

**1. Register User**
```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9876543210",
  "password": "Test@123",
  "role": "user"
}

Tests:
✓ Status code is 201
✓ Response has token
✓ Response has user object
```

**2. Login**
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@123"
}

Tests:
✓ Status code is 200
✓ Response has token
✓ Save token to environment
```

**3. Get Current User**
```http
GET {{base_url}}/auth/me
Authorization: Bearer {{token}}

Tests:
✓ Status code is 200
✓ User data is returned
```

#### Property Tests

**4. Create Property**
```http
POST {{base_url}}/properties
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "3 BHK Apartment in RS Puram",
  "description": "Spacious apartment with modern amenities",
  "property_type": "house",
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
  "pincode": "641002"
}

Tests:
✓ Status code is 201
✓ Property is created
✓ Save property_id
```

**5. Get Properties with Filters**
```http
GET {{base_url}}/properties?region=coimbatore&budgetMin=1000000&budgetMax=10000000
Authorization: Bearer {{token}}

Tests:
✓ Status code is 200
✓ Properties array is returned
✓ Pagination info is present
```

**6. Get Single Property**
```http
GET {{base_url}}/properties/{{property_id}}

Tests:
✓ Status code is 200
✓ Property details are complete
✓ Images are included
```

#### Service Booking Tests

**7. Book Survey Service**
```http
POST {{base_url}}/services/survey/book
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "service_sub_type": "land",
  "property_address": "Plot 123, ABC Layout, Coimbatore",
  "scheduled_date": "2025-02-01",
  "additional_details": "Please call before visiting"
}

Tests:
✓ Status code is 201
✓ Booking created
✓ Amount is correct (8000 for land survey)
```

**8. Calculate EMI**
```http
POST {{base_url}}/services/finance/calculate-emi
Content-Type: application/json

{
  "loan_amount": 5000000,
  "tenure_months": 240,
  "interest_rate": 8.5
}

Tests:
✓ Status code is 200
✓ EMI calculation is returned
✓ Total amount is calculated
```

#### Admin Tests

**9. Branch Admin Dashboard**
```http
GET {{base_url}}/branch-admin/dashboard
Authorization: Bearer {{branch_admin_token}}

Tests:
✓ Status code is 200
✓ Dashboard stats are returned
```

**10. Branch Admin Approve Property**
```http
POST {{base_url}}/branch-admin/properties/{{property_id}}/approve
Authorization: Bearer {{branch_admin_token}}
Content-Type: application/json

{
  "comments": "Property verified and approved"
}

Tests:
✓ Status code is 200
✓ Property status updated
```

---

## 3. Automated Testing

### Backend Tests (Jest + Supertest)

Create test files:

**backend/tests/auth.test.js**
```javascript
const request = require('supertest');
const { app } = require('../server');

describe('Authentication', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          phone: '9876543210',
          password: 'Test@123',
          role: 'user'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should not register with existing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User 2',
          email: 'test@example.com',
          phone: '9876543211',
          password: 'Test@123',
          role: 'user'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test@123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
```

**backend/tests/property.test.js**
```javascript
const request = require('supertest');
const { app } = require('../server');

describe('Properties', () => {
  let token;
  let propertyId;

  beforeAll(async () => {
    // Login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test@123'
      });
    token = res.body.token;
  });

  describe('POST /api/properties', () => {
    it('should create a new property', async () => {
      const res = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Property',
          description: 'Test Description',
          property_type: 'house',
          price: 5000000,
          area: 1500,
          area_unit: 'sqft',
          address: 'Test Address',
          region: 'coimbatore',
          location: 'RS Puram',
          city: 'Coimbatore',
          pincode: '641002'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.property).toHaveProperty('id');
      propertyId = res.body.property.id;
    });
  });

  describe('GET /api/properties', () => {
    it('should get all properties', async () => {
      const res = await request(app).get('/api/properties');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('properties');
      expect(Array.isArray(res.body.properties)).toBe(true);
    });

    it('should filter properties by region', async () => {
      const res = await request(app)
        .get('/api/properties?region=coimbatore');

      expect(res.statusCode).toBe(200);
      expect(res.body.properties.every(p => p.region === 'coimbatore')).toBe(true);
    });
  });
});
```

### Frontend Tests (React Testing Library)

**frontend/src/components/__tests__/Login.test.jsx**
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/auth/Login';
import store from '../redux/store';

const MockLogin = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  </Provider>
);

describe('Login Component', () => {
  it('renders login form', () => {
    render(<MockLogin />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<MockLogin />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please input your email/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<MockLogin />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Test@123' }
    });

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    // Add assertions for successful login
  });
});
```

### Run Tests

**Backend:**
```bash
cd backend
npm install --save-dev jest supertest
npm test
```

**Frontend:**
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm test
```

---

## 4. End-to-End Testing

### Using Cypress

**Install Cypress:**
```bash
cd frontend
npm install --save-dev cypress
npx cypress open
```

**cypress/e2e/user-journey.cy.js**
```javascript
describe('User Journey', () => {
  it('completes full user flow', () => {
    // Visit home page
    cy.visit('http://localhost:5173');

    // Register
    cy.get('a[href="/register"]').click();
    cy.get('input[placeholder="Full Name"]').type('Test User');
    cy.get('input[placeholder="Email"]').type('test@example.com');
    cy.get('input[placeholder="Phone Number"]').type('9876543210');
    cy.get('input[placeholder="Password"]').first().type('Test@123');
    cy.get('input[placeholder="Confirm Password"]').type('Test@123');
    cy.get('button[type="submit"]').click();

    // Should redirect to home
    cy.url().should('include', '/');

    // Browse properties
    cy.get('a[href="/properties"]').click();
    cy.url().should('include', '/properties');

    // Apply filters
    cy.get('.ant-select').first().click();
    cy.contains('Coimbatore').click();

    // View property
    cy.get('.ant-card').first().click();
    cy.url().should('include', '/properties/');

    // Logout
    cy.get('.ant-dropdown-trigger').click();
    cy.contains('Logout').click();
  });
});
```

---

## 5. Performance Testing

### Load Testing with Artillery

**Install Artillery:**
```bash
npm install -g artillery
```

**artillery-config.yml**
```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: Warm up
    - duration: 120
      arrivalRate: 50
      name: Sustained load
scenarios:
  - name: Browse properties
    flow:
      - get:
          url: '/api/properties'
      - get:
          url: '/api/properties/{{ $randomString() }}'
```

**Run load test:**
```bash
artillery run artillery-config.yml
```

---

## Testing Checklist Summary

### ✅ Manual Testing
- [ ] All authentication flows
- [ ] Property CRUD operations
- [ ] Cascading filters
- [ ] Service bookings (all 4 types)
- [ ] Admin workflows
- [ ] Chat system
- [ ] Payment flow

### ✅ API Testing
- [ ] Postman collection created
- [ ] All endpoints tested
- [ ] Edge cases covered
- [ ] Error responses validated

### ✅ Automated Testing
- [ ] Backend unit tests
- [ ] Frontend component tests
- [ ] Integration tests
- [ ] Test coverage > 70%

### ✅ E2E Testing
- [ ] Cypress tests written
- [ ] Full user journeys tested
- [ ] Cross-browser testing

### ✅ Performance Testing
- [ ] Load testing completed
- [ ] Response times < 500ms
- [ ] Concurrent users supported

---

## Common Issues & Solutions

### Issue: CORS errors
**Solution:** Verify CORS configuration in backend server.js

### Issue: Token expired
**Solution:** Implement token refresh mechanism

### Issue: Database connection failed
**Solution:** Check PostgreSQL is running and credentials are correct

### Issue: Image upload fails
**Solution:** Verify AWS S3 credentials and bucket permissions

---

**Testing is complete when all boxes are checked!** ✅
