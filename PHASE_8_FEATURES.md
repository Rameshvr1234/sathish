# Phase 8: Advanced Features Implementation

## Overview
Phase 8 introduces five major optional enhancements to the real estate portal:
1. **360° Virtual Tours** - Immersive property viewing experience
2. **AI-Powered Recommendations** - Personalized property suggestions
3. **Home Loan Integration** - Complete loan application system
4. **Video Call Tours** - Live video property tours with agents
5. **Advanced Analytics** - Comprehensive property performance tracking

---

## 1. 360° Virtual Tours

### Features
- Multiple panorama image support
- External tour integration (Matterport, Kuula)
- Auto-rotation and manual navigation
- Fullscreen support
- View tracking and analytics
- Scene-based navigation with thumbnails

### Backend Implementation

#### Models
- **VirtualTour** (`backend/models/VirtualTour.js`)
  - Supports 360° images, videos, and external tours
  - Tracks views and average viewing duration
  - Hotspot support for interactive elements
  - Multiple scene management

#### API Endpoints
- `GET /api/virtual-tours/property/:propertyId` - Get tours for a property
- `POST /api/virtual-tours` - Create new virtual tour
- `PUT /api/virtual-tours/:id` - Update virtual tour
- `POST /api/virtual-tours/:id/view` - Track tour view
- `DELETE /api/virtual-tours/:id` - Delete virtual tour

### Frontend Implementation

#### Components
- **VirtualTourViewer** (`frontend/src/pages/VirtualTourViewer.jsx`)
  - Full-screen immersive viewer
  - Scene navigation with thumbnails
  - Auto-rotation controls
  - View duration tracking
  - Responsive design

#### Usage Example
```jsx
// Navigate to virtual tour
navigate(`/virtual-tour/${tourId}`);

// Create virtual tour
const tour = await api.post('/virtual-tours', {
  property_id: propertyId,
  title: 'Living Room Tour',
  tour_type: '360_image',
  panorama_images: [
    {
      url: 'https://example.com/panorama1.jpg',
      title: 'Living Room',
      hotspots: []
    }
  ]
});
```

### Database Schema
```sql
CREATE TABLE virtual_tours (
  id UUID PRIMARY KEY,
  property_id UUID NOT NULL,
  title VARCHAR(200),
  tour_type ENUM('360_image', '360_video', 'matterport', 'custom'),
  panorama_images JSONB,
  tour_url VARCHAR(500),
  views_count INTEGER DEFAULT 0,
  avg_view_duration INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 2. AI-Powered Recommendations

### Features
- Collaborative filtering + content-based recommendations
- User behavior analysis (views, shortlists, searches)
- Real-time recommendation generation
- Relevance feedback system
- Match scoring with detailed factors
- Human-readable recommendation reasons

### Algorithm
The recommendation engine uses a hybrid approach:
1. **User Preference Extraction**
   - Analyze recently viewed properties
   - Extract patterns from shortlisted items
   - Consider active property alerts

2. **Scoring System**
   - Property type match (25% weight)
   - Location match (20% weight)
   - Listing type match (15% weight)
   - Price range match (20% weight)
   - Bedroom preference (10% weight)
   - Popularity score (10% weight)

3. **Personalization**
   - Exclude user's own properties
   - Filter by approval status
   - Consider user feedback for future recommendations

### Backend Implementation

#### Models
- **AIRecommendation** (`backend/models/AIRecommendation.js`)
  - Stores recommendations with scores and factors
  - Tracks user interactions (shown, clicked, contacted)
  - Feedback collection for model improvement
  - Model versioning support

#### API Endpoints
- `GET /api/ai-recommendations` - Get personalized recommendations
- `POST /api/ai-recommendations/:id/track-shown` - Track when shown
- `POST /api/ai-recommendations/:id/track-click` - Track clicks
- `POST /api/ai-recommendations/:id/feedback` - Submit feedback

### Frontend Implementation

#### Components
- **AIRecommendations** (`frontend/src/components/AIRecommendations.jsx`)
  - Property cards with match scores
  - Color-coded relevance indicators
  - Recommendation reasons display
  - Like/dislike feedback buttons
  - Refresh functionality

#### Usage Example
```jsx
// Display recommendations
<AIRecommendations limit={6} showRefresh={true} />

// Get recommendations programmatically
const recommendations = await api.get('/ai-recommendations', {
  params: { limit: 10, refresh: true }
});
```

### Database Schema
```sql
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID NOT NULL,
  score DECIMAL(5,4),
  factors JSONB,
  reason TEXT,
  model_version VARCHAR(50),
  shown_at TIMESTAMP,
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMP,
  feedback_score INTEGER,
  is_relevant BOOLEAN,
  created_at TIMESTAMP
);
```

---

## 3. Home Loan Integration

### Features
- Multiple bank partners with varying rates
- EMI calculator with amortization schedule
- Loan eligibility calculator
- Multi-step application form
- Document management
- Application status tracking
- Bank partner comparisons

### Supported Banks
- HDFC Bank (8.5% - 9.5%)
- ICICI Bank (8.6% - 9.6%)
- SBI (8.4% - 9.4%)
- Axis Bank (8.75% - 9.75%)
- Kotak Mahindra Bank (8.7% - 9.7%)

### Backend Implementation

#### Models
- **HomeLoanApplication** (`backend/models/HomeLoanApplication.js`)
  - Complete application data storage
  - Co-applicant support
  - Document tracking
  - Status workflow management
  - Approval/rejection tracking

#### API Endpoints
- `GET /api/home-loans/banks` - Get bank partners list
- `POST /api/home-loans/calculate-eligibility` - Calculate eligibility
- `POST /api/home-loans/calculate-emi` - Calculate EMI
- `GET /api/home-loans/my-applications` - Get user's applications
- `POST /api/home-loans/apply` - Submit loan application
- `PUT /api/home-loans/:id` - Update application
- `POST /api/home-loans/:id/submit` - Submit for review
- `GET /api/home-loans/:id` - Get application details

### Frontend Implementation

#### Components
- **HomeLoanApplication** (`frontend/src/pages/HomeLoanApplication.jsx`)
  - 4-step application wizard
  - Live EMI calculation
  - Eligibility checker
  - Form validation
  - Application review

#### Application Steps
1. **Loan Details** - Bank selection, loan amount, tenure
2. **Personal Info** - KYC details, PAN, Aadhar
3. **Employment** - Income, company, credit score
4. **Review** - Final review before submission

### Database Schema
```sql
CREATE TABLE home_loan_applications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID,
  application_number VARCHAR(50) UNIQUE,
  bank_name VARCHAR(100),
  loan_type ENUM('home_loan', 'loan_against_property', 'balance_transfer', 'top_up'),
  loan_amount DECIMAL(15,2),
  property_value DECIMAL(15,2),
  interest_rate DECIMAL(5,2),
  tenure_months INTEGER,
  emi_amount DECIMAL(15,2),
  applicant_name VARCHAR(200),
  employment_type ENUM('salaried', 'self_employed', 'business', 'professional'),
  monthly_income DECIMAL(15,2),
  status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 4. Video Call Tours

### Features
- Live video tours with agents
- Agora WebRTC integration
- Tour scheduling system
- Agent assignment
- Recording support
- Feedback and ratings
- Reminder notifications

### Backend Implementation

#### Models
- **VideoCallTour** (`backend/models/VideoCallTour.js`)
  - Scheduling and status management
  - Agora token generation
  - Duration tracking
  - Feedback collection

#### API Endpoints
- `GET /api/video-call-tours/my-tours` - Get user's tours
- `POST /api/video-call-tours` - Schedule new tour
- `PUT /api/video-call-tours/:id/confirm` - Confirm tour (agent)
- `PUT /api/video-call-tours/:id/start` - Start tour
- `PUT /api/video-call-tours/:id/end` - End tour
- `PUT /api/video-call-tours/:id/cancel` - Cancel tour
- `PUT /api/video-call-tours/:id/feedback` - Submit feedback

### Tour Status Workflow
```
scheduled → confirmed → in_progress → completed
     ↓           ↓            ↓
cancelled   cancelled    cancelled
```

### Database Schema
```sql
CREATE TABLE video_call_tours (
  id UUID PRIMARY KEY,
  property_id UUID NOT NULL,
  user_id UUID NOT NULL,
  agent_id UUID,
  scheduled_at TIMESTAMP,
  duration_minutes INTEGER DEFAULT 30,
  status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'),
  channel_name VARCHAR(200),
  agora_token TEXT,
  user_notes TEXT,
  agent_notes TEXT,
  rating INTEGER,
  feedback TEXT,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP
);
```

### Integration Guide
```javascript
// Schedule video call tour
const tour = await api.post('/video-call-tours', {
  property_id: 'property-uuid',
  scheduled_at: '2025-12-01T10:00:00Z',
  duration_minutes: 30,
  user_notes: 'Want to see the kitchen and balcony'
});

// Start tour (generates fresh token)
const { channel_name, agora_token } = await api.put(
  `/video-call-tours/${tourId}/start`
);

// Initialize Agora client
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
await client.join(APP_ID, channel_name, agora_token, userId);
```

---

## 5. Advanced Analytics

### Features
- Property performance tracking
- Daily analytics aggregation
- Traffic source analysis
- Device breakdown
- Location-based insights
- Conversion rate tracking
- Market insights dashboard
- Owner analytics dashboard

### Tracked Metrics
- Page views (total and unique)
- Shortlists
- Contact requests
- Shares
- Virtual tour views
- Video call requests
- Site visit requests
- Average time on page
- Bounce rate
- Conversion rate

### Backend Implementation

#### Models
- **PropertyAnalytics** (`backend/models/PropertyAnalytics.js`)
  - Daily aggregated metrics
  - Traffic and device breakdown
  - Location insights
  - Keyword tracking

#### API Endpoints
- `GET /api/analytics/property/:propertyId` - Property analytics
- `POST /api/analytics/track-view` - Track property view
- `POST /api/analytics/track-action` - Track user actions
- `GET /api/analytics/dashboard` - Owner dashboard
- `GET /api/analytics/market-insights` - Market trends

### Database Schema
```sql
CREATE TABLE property_analytics (
  id UUID PRIMARY KEY,
  property_id UUID NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  shortlists INTEGER DEFAULT 0,
  contacts INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  virtual_tour_views INTEGER DEFAULT 0,
  video_call_requests INTEGER DEFAULT 0,
  site_visit_requests INTEGER DEFAULT 0,
  avg_time_on_page INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  traffic_sources JSONB DEFAULT '{}',
  device_breakdown JSONB DEFAULT '{}',
  location_breakdown JSONB DEFAULT '{}',
  created_at TIMESTAMP,
  UNIQUE(property_id, date)
);
```

### Usage Example
```javascript
// Track property view
await api.post('/analytics/track-view', {
  property_id: 'property-uuid',
  user_id: 'user-uuid',
  duration: 120, // seconds
  source: 'search',
  device: 'mobile',
  location: 'Coimbatore'
});

// Track action
await api.post('/analytics/track-action', {
  property_id: 'property-uuid',
  action_type: 'contact' // shortlist, contact, share, virtual_tour, etc.
});

// Get property analytics
const analytics = await api.get(`/analytics/property/${propertyId}`, {
  params: {
    startDate: '2025-11-01',
    endDate: '2025-11-30'
  }
});
```

---

## Installation & Setup

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Database Migration**
   ```bash
   # Models will auto-sync on server start
   npm run dev
   ```

3. **Environment Variables**
   ```env
   # Add to .env if using Agora
   AGORA_APP_ID=your_app_id
   AGORA_APP_CERTIFICATE=your_certificate
   ```

### Frontend Setup

1. **Install Dependencies** (if any new ones are needed)
   ```bash
   cd frontend
   npm install
   ```

2. **Update Routes**
   Add Phase 8 routes to your router:
   ```jsx
   import VirtualTourViewer from './pages/VirtualTourViewer';
   import HomeLoanApplication from './pages/HomeLoanApplication';

   // In routes
   <Route path="/virtual-tour/:tourId" element={<VirtualTourViewer />} />
   <Route path="/home-loan/apply/:propertyId?" element={<HomeLoanApplication />} />
   ```

---

## API Testing

### Test Virtual Tours
```bash
# Get virtual tours for a property
curl http://localhost:5000/api/virtual-tours/property/{propertyId}

# Create virtual tour
curl -X POST http://localhost:5000/api/virtual-tours \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": "uuid",
    "title": "Living Room Tour",
    "tour_type": "360_image",
    "panorama_images": [{"url": "image.jpg", "title": "Scene 1"}]
  }'
```

### Test AI Recommendations
```bash
# Get recommendations
curl http://localhost:5000/api/ai-recommendations?limit=10 \
  -H "Authorization: Bearer {token}"

# Submit feedback
curl -X POST http://localhost:5000/api/ai-recommendations/{id}/feedback \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"is_relevant": true, "feedback_score": 5}'
```

### Test Home Loans
```bash
# Calculate eligibility
curl -X POST http://localhost:5000/api/home-loans/calculate-eligibility \
  -H "Content-Type: application/json" \
  -d '{"monthly_income": 100000, "existing_emi": 10000}'

# Apply for loan
curl -X POST http://localhost:5000/api/home-loans/apply \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "bank_name": "HDFC Bank",
    "loan_amount": 5000000,
    "property_value": 6000000,
    "interest_rate": 9.0,
    "tenure_months": 240,
    ...
  }'
```

---

## Mobile App Implementation

### Recommended Mobile Components

1. **Virtual Tour Mobile Viewer**
   - Use `react-native-panorama-view` for 360° images
   - Gyroscope support for immersive experience

2. **AI Recommendations**
   - Reuse mobile/src/components/PropertyCard.jsx
   - Add match score badge overlay

3. **Home Loan Application**
   - Multi-screen wizard navigation
   - Use react-native-step-indicator

4. **Video Call Tours**
   - Integrate Agora React Native SDK
   - Camera and microphone permissions

5. **Analytics Dashboard**
   - Charts using react-native-chart-kit
   - Property performance cards

---

## Security Considerations

1. **Virtual Tours**
   - Validate image URLs
   - Rate limit tour views
   - Sanitize hotspot data

2. **AI Recommendations**
   - Prevent recommendation gaming
   - Limit feedback submissions
   - Cache recommendations

3. **Home Loans**
   - Encrypt sensitive data (PAN, Aadhar)
   - Validate loan calculations server-side
   - Secure document uploads

4. **Video Calls**
   - Generate short-lived tokens
   - Validate tour participants
   - Secure recording storage

5. **Analytics**
   - Anonymize user data
   - Aggregate before exposing
   - Rate limit tracking endpoints

---

## Performance Optimization

1. **Virtual Tours**
   - Lazy load panorama images
   - Compress images (use WebP)
   - CDN for media assets

2. **AI Recommendations**
   - Cache recommendations (1 hour)
   - Background job for generation
   - Index recommendation scores

3. **Analytics**
   - Batch analytics writes
   - Async tracking calls
   - Pre-aggregate common queries

---

## Future Enhancements

1. **Virtual Tours**
   - VR headset support
   - Voice-guided tours
   - Floor plan integration

2. **AI Recommendations**
   - Deep learning models
   - Image similarity matching
   - Neighborhood recommendations

3. **Home Loans**
   - Real-time bank API integration
   - Automated document verification
   - Pre-approval process

4. **Video Calls**
   - AR furniture placement
   - Multi-party tours
   - Automated tour highlights

5. **Analytics**
   - Predictive analytics
   - A/B testing framework
   - Competitor analysis

---

## Support & Documentation

- **Backend API**: All routes documented in respective route files
- **Frontend Components**: JSDoc comments in component files
- **Database**: Sequelize models with inline documentation
- **Testing**: See test examples above

## License
Proprietary - Real Estate Portal Project

---

**Phase 8 Completion Date**: 2025-11-12
**Total Files Created**: 15+ backend + frontend files
**Lines of Code**: ~10,000+ lines
**Features**: 5 major features with 20+ API endpoints
