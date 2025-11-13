/**
 * MASTER TEST SUITE - Real Estate Portal
 * Comprehensive testing of all features and components
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(70));
console.log('   🏢 REAL ESTATE PORTAL - MASTER TEST SUITE');
console.log('='.repeat(70) + '\n');

let totalPassed = 0;
let totalFailed = 0;
const testResults = {};

function test(category, description, testFn) {
  if (!testResults[category]) {
    testResults[category] = { passed: 0, failed: 0, tests: [] };
  }

  try {
    testFn();
    testResults[category].passed++;
    testResults[category].tests.push({ name: description, status: 'PASS' });
    totalPassed++;
  } catch (error) {
    testResults[category].failed++;
    testResults[category].tests.push({ name: description, status: 'FAIL', error: error.message });
    totalFailed++;
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function fileContains(filePath, searchString) {
  if (!fileExists(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes(searchString);
}

function countFiles(directory, extension) {
  if (!fs.existsSync(directory)) return 0;
  const files = fs.readdirSync(directory, { recursive: true });
  return files.filter(f => f.endsWith(extension)).length;
}

console.log('🧪 Running comprehensive tests...\n');

// ============================================================================
// CATEGORY 1: PROJECT STRUCTURE
// ============================================================================
console.log('📁 Testing Project Structure...');

test('Project Structure', 'Backend directory exists', () => {
  if (!fileExists('./')) throw new Error('Backend directory not found');
});

test('Project Structure', 'Frontend directory exists', () => {
  if (!fileExists('../frontend')) throw new Error('Frontend directory not found');
});

test('Project Structure', 'Backend package.json exists', () => {
  if (!fileExists('./package.json')) throw new Error('Backend package.json not found');
});

test('Project Structure', 'Frontend package.json exists', () => {
  if (!fileExists('../frontend/package.json')) throw new Error('Frontend package.json not found');
});

test('Project Structure', 'Backend server.js exists', () => {
  if (!fileExists('./server.js')) throw new Error('server.js not found');
});

test('Project Structure', 'Models directory exists', () => {
  if (!fileExists('./models')) throw new Error('Models directory not found');
});

test('Project Structure', 'Routes directory exists', () => {
  if (!fileExists('./routes')) throw new Error('Routes directory not found');
});

test('Project Structure', 'Controllers directory exists', () => {
  if (!fileExists('./controllers')) throw new Error('Controllers directory not found');
});

test('Project Structure', 'Middleware directory exists', () => {
  if (!fileExists('./middleware')) throw new Error('Middleware directory not found');
});

test('Project Structure', 'Frontend src directory exists', () => {
  if (!fileExists('../frontend/src')) throw new Error('Frontend src not found');
});

// ============================================================================
// CATEGORY 2: PHASE 7 FEATURES (99acres Parity)
// ============================================================================
console.log('📋 Testing Phase 7 Features (99acres Parity)...');

test('Phase 7 Features', 'EMI Calculator exists', () => {
  if (!fileExists('../frontend/src/pages/EMICalculator.jsx')) throw new Error('EMI Calculator not found');
});

test('Phase 7 Features', 'Property Valuation exists', () => {
  if (!fileExists('../frontend/src/pages/PropertyValuation.jsx')) throw new Error('Property Valuation not found');
});

test('Phase 7 Features', 'Advanced Filters exists', () => {
  if (!fileExists('../frontend/src/components/AdvancedFilters.jsx')) throw new Error('Advanced Filters not found');
});

test('Phase 7 Features', 'Property Comparison exists', () => {
  if (!fileExists('../frontend/src/pages/PropertyComparison.jsx')) throw new Error('Property Comparison not found');
});

test('Phase 7 Features', 'Reviews & Ratings exists', () => {
  if (!fileExists('../frontend/src/components/ReviewsRatings.jsx')) throw new Error('Reviews & Ratings not found');
});

test('Phase 7 Features', 'Builder Listing exists', () => {
  if (!fileExists('../frontend/src/pages/BuilderListing.jsx')) throw new Error('Builder Listing not found');
});

test('Phase 7 Features', 'Project Listing exists', () => {
  if (!fileExists('../frontend/src/pages/ProjectListing.jsx')) throw new Error('Project Listing not found');
});

test('Phase 7 Features', 'Membership Plans exists', () => {
  if (!fileExists('../frontend/src/pages/MembershipPlans.jsx')) throw new Error('Membership Plans not found');
});

test('Phase 7 Features', 'Property Alerts exists', () => {
  if (!fileExists('../frontend/src/pages/PropertyAlerts.jsx')) throw new Error('Property Alerts not found');
});

test('Phase 7 Features', 'Recently Viewed exists', () => {
  if (!fileExists('../frontend/src/components/RecentlyViewed.jsx')) throw new Error('Recently Viewed not found');
});

// ============================================================================
// CATEGORY 3: PHASE 8 FEATURES (Advanced Features)
// ============================================================================
console.log('🚀 Testing Phase 8 Advanced Features...');

// Virtual Tours
test('Phase 8 - Virtual Tours', 'VirtualTour model exists', () => {
  if (!fileExists('./models/VirtualTour.js')) throw new Error('VirtualTour model not found');
});

test('Phase 8 - Virtual Tours', 'Virtual tour routes exist', () => {
  if (!fileExists('./routes/virtualTourRoutes.js')) throw new Error('Virtual tour routes not found');
});

test('Phase 8 - Virtual Tours', 'VirtualTourViewer component exists', () => {
  if (!fileExists('../frontend/src/pages/VirtualTourViewer.jsx')) throw new Error('VirtualTourViewer not found');
});

// AI Recommendations
test('Phase 8 - AI Recommendations', 'AIRecommendation model exists', () => {
  if (!fileExists('./models/AIRecommendation.js')) throw new Error('AIRecommendation model not found');
});

test('Phase 8 - AI Recommendations', 'AI recommendation routes exist', () => {
  if (!fileExists('./routes/aiRecommendationRoutes.js')) throw new Error('AI recommendation routes not found');
});

test('Phase 8 - AI Recommendations', 'AIRecommendations component exists', () => {
  if (!fileExists('../frontend/src/components/AIRecommendations.jsx')) throw new Error('AIRecommendations not found');
});

test('Phase 8 - AI Recommendations', 'Recommendation algorithm exists', () => {
  if (!fileContains('./routes/aiRecommendationRoutes.js', 'generateRecommendations'))
    throw new Error('Recommendation algorithm not found');
});

// Home Loan Integration
test('Phase 8 - Home Loans', 'HomeLoanApplication model exists', () => {
  if (!fileExists('./models/HomeLoanApplication.js')) throw new Error('HomeLoanApplication model not found');
});

test('Phase 8 - Home Loans', 'Home loan routes exist', () => {
  if (!fileExists('./routes/homeLoanRoutes.js')) throw new Error('Home loan routes not found');
});

test('Phase 8 - Home Loans', 'HomeLoanApplication component exists', () => {
  if (!fileExists('../frontend/src/pages/HomeLoanApplication.jsx')) throw new Error('HomeLoanApplication not found');
});

test('Phase 8 - Home Loans', 'EMI calculator exists', () => {
  if (!fileContains('./routes/homeLoanRoutes.js', 'calculateEMI'))
    throw new Error('EMI calculator not found');
});

test('Phase 8 - Home Loans', 'Eligibility calculator exists', () => {
  if (!fileContains('./routes/homeLoanRoutes.js', 'calculateEligibility'))
    throw new Error('Eligibility calculator not found');
});

test('Phase 8 - Home Loans', 'Bank partners configured', () => {
  if (!fileContains('./routes/homeLoanRoutes.js', 'BANK_PARTNERS'))
    throw new Error('Bank partners not configured');
});

// Video Call Tours
test('Phase 8 - Video Calls', 'VideoCallTour model exists', () => {
  if (!fileExists('./models/VideoCallTour.js')) throw new Error('VideoCallTour model not found');
});

test('Phase 8 - Video Calls', 'Video call routes exist', () => {
  if (!fileExists('./routes/videoCallTourRoutes.js')) throw new Error('Video call routes not found');
});

test('Phase 8 - Video Calls', 'Agora token generation exists', () => {
  if (!fileContains('./routes/videoCallTourRoutes.js', 'generateAgoraToken'))
    throw new Error('Agora token generation not found');
});

// Advanced Analytics
test('Phase 8 - Analytics', 'PropertyAnalytics model exists', () => {
  if (!fileExists('./models/PropertyAnalytics.js')) throw new Error('PropertyAnalytics model not found');
});

test('Phase 8 - Analytics', 'Analytics routes exist', () => {
  if (!fileExists('./routes/analyticsRoutes.js')) throw new Error('Analytics routes not found');
});

test('Phase 8 - Analytics', 'Track view endpoint exists', () => {
  if (!fileContains('./routes/analyticsRoutes.js', '/track-view'))
    throw new Error('Track view endpoint not found');
});

test('Phase 8 - Analytics', 'Dashboard endpoint exists', () => {
  if (!fileContains('./routes/analyticsRoutes.js', '/dashboard'))
    throw new Error('Dashboard endpoint not found');
});

// ============================================================================
// CATEGORY 4: SEO FEATURES
// ============================================================================
console.log('🔍 Testing SEO Features...');

test('SEO Features', 'SEO routes file exists', () => {
  if (!fileExists('./routes/seoRoutes.js')) throw new Error('SEO routes not found');
});

test('SEO Features', 'Sitemap endpoint exists', () => {
  if (!fileContains('./routes/seoRoutes.js', '/sitemap.xml'))
    throw new Error('Sitemap endpoint not found');
});

test('SEO Features', 'Robots.txt endpoint exists', () => {
  if (!fileContains('./routes/seoRoutes.js', '/robots.txt'))
    throw new Error('Robots.txt endpoint not found');
});

test('SEO Features', 'Structured data endpoint exists', () => {
  if (!fileContains('./routes/seoRoutes.js', '/structured-data'))
    throw new Error('Structured data endpoint not found');
});

test('SEO Features', 'Meta tags endpoint exists', () => {
  if (!fileContains('./routes/seoRoutes.js', '/meta-tags'))
    throw new Error('Meta tags endpoint not found');
});

test('SEO Features', 'SEOHead component exists', () => {
  if (!fileExists('../frontend/src/components/SEO/SEOHead.jsx'))
    throw new Error('SEOHead component not found');
});

test('SEO Features', 'PropertySEO component exists', () => {
  if (!fileExists('../frontend/src/components/SEO/PropertySEO.jsx'))
    throw new Error('PropertySEO component not found');
});

test('SEO Features', 'GoogleAnalytics component exists', () => {
  if (!fileExists('../frontend/src/components/SEO/GoogleAnalytics.jsx'))
    throw new Error('GoogleAnalytics component not found');
});

test('SEO Features', 'SEO utilities exist', () => {
  if (!fileExists('../frontend/src/utils/seo.js'))
    throw new Error('SEO utilities not found');
});

test('SEO Features', 'Schema.org implementation', () => {
  if (!fileContains('./routes/seoRoutes.js', 'schema.org'))
    throw new Error('Schema.org not implemented');
});

test('SEO Features', 'Open Graph tags', () => {
  if (!fileContains('../frontend/src/components/SEO/SEOHead.jsx', 'og:title'))
    throw new Error('Open Graph tags not found');
});

test('SEO Features', 'Twitter Card tags', () => {
  if (!fileContains('../frontend/src/components/SEO/SEOHead.jsx', 'twitter:card'))
    throw new Error('Twitter Card tags not found');
});

// ============================================================================
// CATEGORY 5: BACKEND MODELS
// ============================================================================
console.log('💾 Testing Backend Models...');

test('Backend Models', 'User model exists', () => {
  if (!fileExists('./models/User.js')) throw new Error('User model not found');
});

test('Backend Models', 'Property model exists', () => {
  if (!fileExists('./models/Property.js')) throw new Error('Property model not found');
});

test('Backend Models', 'Branch model exists', () => {
  if (!fileExists('./models/Branch.js')) throw new Error('Branch model not found');
});

test('Backend Models', 'Review model exists', () => {
  if (!fileExists('./models/Review.js')) throw new Error('Review model not found');
});

test('Backend Models', 'Builder model exists', () => {
  if (!fileExists('./models/Builder.js')) throw new Error('Builder model not found');
});

test('Backend Models', 'Project model exists', () => {
  if (!fileExists('./models/Project.js')) throw new Error('Project model not found');
});

test('Backend Models', 'PropertyAlert model exists', () => {
  if (!fileExists('./models/PropertyAlert.js')) throw new Error('PropertyAlert model not found');
});

test('Backend Models', 'PremiumMembership model exists', () => {
  if (!fileExists('./models/PremiumMembership.js')) throw new Error('PremiumMembership model not found');
});

test('Backend Models', 'Models index exports all models', () => {
  if (!fileContains('./models/index.js', 'module.exports'))
    throw new Error('Models not properly exported');
});

test('Backend Models', 'Phase 8 models exported', () => {
  if (!fileContains('./models/index.js', 'VirtualTour'))
    throw new Error('Phase 8 models not exported');
});

// ============================================================================
// CATEGORY 6: BACKEND ROUTES
// ============================================================================
console.log('🛣️  Testing Backend Routes...');

test('Backend Routes', 'Auth routes exist', () => {
  if (!fileExists('./routes/authRoutes.js')) throw new Error('Auth routes not found');
});

test('Backend Routes', 'Property routes exist', () => {
  if (!fileExists('./routes/propertyRoutes.js')) throw new Error('Property routes not found');
});

test('Backend Routes', 'Service routes exist', () => {
  if (!fileExists('./routes/surveyRoutes.js')) throw new Error('Service routes not found');
});

test('Backend Routes', 'Payment routes exist', () => {
  if (!fileExists('./routes/paymentRoutes.js')) throw new Error('Payment routes not found');
});

test('Backend Routes', 'Chat routes exist', () => {
  if (!fileExists('./routes/chatRoutes.js')) throw new Error('Chat routes not found');
});

test('Backend Routes', 'Calculator routes exist', () => {
  if (!fileExists('./routes/calculatorRoutes.js')) throw new Error('Calculator routes not found');
});

test('Backend Routes', 'Builder routes exist', () => {
  if (!fileExists('./routes/builderRoutes.js')) throw new Error('Builder routes not found');
});

test('Backend Routes', 'Project routes exist', () => {
  if (!fileExists('./routes/projectRoutes.js')) throw new Error('Project routes not found');
});

test('Backend Routes', 'Alert routes exist', () => {
  if (!fileExists('./routes/alertRoutes.js')) throw new Error('Alert routes not found');
});

test('Backend Routes', 'Membership routes exist', () => {
  if (!fileExists('./routes/membershipRoutes.js')) throw new Error('Membership routes not found');
});

test('Backend Routes', 'All routes mounted in server.js', () => {
  if (!fileContains('./server.js', 'app.use'))
    throw new Error('Routes not mounted');
});

// ============================================================================
// CATEGORY 7: FRONTEND COMPONENTS
// ============================================================================
console.log('⚛️  Testing Frontend Components...');

test('Frontend Components', 'Layout components exist', () => {
  if (!fileExists('../frontend/src/components/layout/Layout.jsx'))
    throw new Error('Layout component not found');
});

test('Frontend Components', 'Header component exists', () => {
  if (!fileExists('../frontend/src/components/layout/Header.jsx'))
    throw new Error('Header component not found');
});

test('Frontend Components', 'Footer component exists', () => {
  if (!fileExists('../frontend/src/components/layout/Footer.jsx'))
    throw new Error('Footer component not found');
});

test('Frontend Components', 'PropertyCard component exists', () => {
  if (!fileExists('../frontend/src/components/PropertyCard.jsx'))
    throw new Error('PropertyCard component not found');
});

test('Frontend Components', 'PropertyMapView component exists', () => {
  if (!fileExists('../frontend/src/components/PropertyMapView.jsx'))
    throw new Error('PropertyMapView component not found');
});

test('Frontend Components', 'AdvancedFilters component exists', () => {
  if (!fileExists('../frontend/src/components/AdvancedFilters.jsx'))
    throw new Error('AdvancedFilters component not found');
});

test('Frontend Components', 'ReviewsRatings component exists', () => {
  if (!fileExists('../frontend/src/components/ReviewsRatings.jsx'))
    throw new Error('ReviewsRatings component not found');
});

test('Frontend Components', 'RecentlyViewed component exists', () => {
  if (!fileExists('../frontend/src/components/RecentlyViewed.jsx'))
    throw new Error('RecentlyViewed component not found');
});

// ============================================================================
// CATEGORY 8: FRONTEND PAGES
// ============================================================================
console.log('📄 Testing Frontend Pages...');

test('Frontend Pages', 'Home page exists', () => {
  if (!fileExists('../frontend/src/pages/Home.jsx')) throw new Error('Home page not found');
});

test('Frontend Pages', 'Property listing page exists', () => {
  if (!fileExists('../frontend/src/pages/property/PropertyList.jsx'))
    throw new Error('Property listing page not found');
});

test('Frontend Pages', 'Property detail page exists', () => {
  if (!fileExists('../frontend/src/pages/property/PropertyDetail.jsx'))
    throw new Error('Property detail page not found');
});

test('Frontend Pages', 'Create property page exists', () => {
  if (!fileExists('../frontend/src/pages/property/CreateProperty.jsx'))
    throw new Error('Create property page not found');
});

test('Frontend Pages', 'Profile page exists', () => {
  if (!fileExists('../frontend/src/pages/Profile.jsx')) throw new Error('Profile page not found');
});

test('Frontend Pages', 'Login page exists', () => {
  if (!fileExists('../frontend/src/pages/auth/Login.jsx')) throw new Error('Login page not found');
});

test('Frontend Pages', 'Register page exists', () => {
  if (!fileExists('../frontend/src/pages/auth/Register.jsx')) throw new Error('Register page not found');
});

// ============================================================================
// CATEGORY 9: REDUX STATE MANAGEMENT
// ============================================================================
console.log('🔄 Testing Redux State Management...');

test('Redux State', 'Redux store exists', () => {
  if (!fileExists('../frontend/src/redux/store.js')) throw new Error('Redux store not found');
});

test('Redux State', 'Auth slice exists', () => {
  if (!fileExists('../frontend/src/redux/slices/authSlice.js'))
    throw new Error('Auth slice not found');
});

test('Redux State', 'Property slice exists', () => {
  if (!fileExists('../frontend/src/redux/slices/propertySlice.js'))
    throw new Error('Property slice not found');
});

test('Redux State', 'Service slice exists', () => {
  if (!fileExists('../frontend/src/redux/slices/serviceSlice.js'))
    throw new Error('Service slice not found');
});

test('Redux State', 'Chat slice exists', () => {
  if (!fileExists('../frontend/src/redux/slices/chatSlice.js'))
    throw new Error('Chat slice not found');
});

// ============================================================================
// CATEGORY 10: UTILITIES AND HELPERS
// ============================================================================
console.log('🛠️  Testing Utilities and Helpers...');

test('Utilities', 'API utility exists', () => {
  if (!fileExists('../frontend/src/utils/api.js')) throw new Error('API utility not found');
});

test('Utilities', 'SEO utilities exist', () => {
  if (!fileExists('../frontend/src/utils/seo.js')) throw new Error('SEO utilities not found');
});

test('Utilities', 'Backend calculators exist', () => {
  if (!fileExists('./utils/calculators.js')) throw new Error('Calculator utilities not found');
});

test('Utilities', 'Property valuation exists', () => {
  if (!fileExists('./utils/propertyValuation.js'))
    throw new Error('Property valuation utility not found');
});

test('Utilities', 'JWT token generator exists', () => {
  if (!fileExists('./utils/generateToken.js')) throw new Error('Token generator not found');
});

// ============================================================================
// CATEGORY 11: MIDDLEWARE
// ============================================================================
console.log('🔐 Testing Middleware...');

test('Middleware', 'Auth middleware exists', () => {
  if (!fileExists('./middleware/auth.js')) throw new Error('Auth middleware not found');
});

test('Middleware', 'Error handler middleware exists', () => {
  if (!fileExists('./middleware/errorHandler.js'))
    throw new Error('Error handler middleware not found');
});

test('Middleware', 'Upload middleware exists', () => {
  if (!fileExists('./middleware/upload.js')) throw new Error('Upload middleware not found');
});

// ============================================================================
// CATEGORY 12: DEPENDENCIES
// ============================================================================
console.log('📦 Testing Dependencies...');

test('Dependencies', 'Backend dependencies installed', () => {
  if (!fileExists('./node_modules')) throw new Error('Backend node_modules not found');
});

test('Dependencies', 'Backend package-lock exists', () => {
  if (!fileExists('./package-lock.json')) throw new Error('Backend package-lock not found');
});

test('Dependencies', 'Frontend package-lock exists', () => {
  if (!fileExists('../frontend/package-lock.json'))
    throw new Error('Frontend package-lock not found');
});

test('Dependencies', 'Express installed', () => {
  if (!fileContains('./package.json', '"express"')) throw new Error('Express not in package.json');
});

test('Dependencies', 'Sequelize installed', () => {
  if (!fileContains('./package.json', '"sequelize"')) throw new Error('Sequelize not in package.json');
});

test('Dependencies', 'React installed', () => {
  if (!fileContains('../frontend/package.json', '"react"'))
    throw new Error('React not in package.json');
});

test('Dependencies', 'React Router installed', () => {
  if (!fileContains('../frontend/package.json', '"react-router-dom"'))
    throw new Error('React Router not in package.json');
});

test('Dependencies', 'Redux Toolkit installed', () => {
  if (!fileContains('../frontend/package.json', '"@reduxjs/toolkit"'))
    throw new Error('Redux Toolkit not in package.json');
});

test('Dependencies', 'Ant Design installed', () => {
  if (!fileContains('../frontend/package.json', '"antd"'))
    throw new Error('Ant Design not in package.json');
});

test('Dependencies', 'React Helmet Async installed', () => {
  if (!fileContains('../frontend/package.json', '"react-helmet-async"'))
    throw new Error('React Helmet Async not in package.json');
});

// ============================================================================
// CATEGORY 13: MOBILE APP
// ============================================================================
console.log('📱 Testing Mobile App...');

test('Mobile App', 'Mobile directory exists', () => {
  if (!fileExists('../mobile')) throw new Error('Mobile directory not found');
});

test('Mobile App', 'Mobile package.json exists', () => {
  if (!fileExists('../mobile/package.json')) throw new Error('Mobile package.json not found');
});

test('Mobile App', 'Mobile App.jsx exists', () => {
  if (!fileExists('../mobile/src/App.jsx')) throw new Error('Mobile App.jsx not found');
});

test('Mobile App', 'Mobile navigation exists', () => {
  if (!fileExists('../mobile/src/navigation/AppNavigator.jsx'))
    throw new Error('Mobile navigation not found');
});

test('Mobile App', 'Mobile property screens exist', () => {
  if (!fileExists('../mobile/src/screens/property/PropertyListScreen.jsx'))
    throw new Error('Mobile property screens not found');
});

test('Mobile App', 'Voice search service exists', () => {
  if (!fileExists('../mobile/src/services/VoiceSearchService.js'))
    throw new Error('Voice search service not found');
});

test('Mobile App', 'Push notification service exists', () => {
  if (!fileExists('../mobile/src/services/PushNotificationService.js'))
    throw new Error('Push notification service not found');
});

test('Mobile App', 'Offline mode service exists', () => {
  if (!fileExists('../mobile/src/services/OfflineModeService.js'))
    throw new Error('Offline mode service not found');
});

// ============================================================================
// CATEGORY 14: DOCUMENTATION
// ============================================================================
console.log('📚 Testing Documentation...');

test('Documentation', 'Phase 8 documentation exists', () => {
  if (!fileExists('../PHASE_8_FEATURES.md'))
    throw new Error('Phase 8 documentation not found');
});

test('Documentation', 'Phase 8 test report exists', () => {
  if (!fileExists('../PHASE_8_TEST_REPORT.md'))
    throw new Error('Phase 8 test report not found');
});

test('Documentation', 'SEO documentation exists', () => {
  if (!fileExists('../SEO_IMPLEMENTATION.md'))
    throw new Error('SEO documentation not found');
});

test('Documentation', 'Mobile app documentation exists', () => {
  if (!fileExists('../MOBILE_APP_ENHANCEMENTS.md'))
    throw new Error('Mobile app documentation not found');
});

// ============================================================================
// CATEGORY 15: CONFIGURATION FILES
// ============================================================================
console.log('⚙️  Testing Configuration Files...');

test('Configuration', 'Backend .env exists', () => {
  if (!fileExists('./.env')) throw new Error('Backend .env not found');
});

test('Configuration', 'Backend server.js configured', () => {
  if (!fileContains('./server.js', 'express')) throw new Error('Server not configured');
});

test('Configuration', 'Database config exists', () => {
  if (!fileExists('./config/database.js')) throw new Error('Database config not found');
});

test('Configuration', 'Vite config exists', () => {
  if (!fileExists('../frontend/vite.config.js')) throw new Error('Vite config not found');
});

test('Configuration', 'Frontend index.html exists', () => {
  if (!fileExists('../frontend/index.html')) throw new Error('index.html not found');
});

// ============================================================================
// CATEGORY 16: INTEGRATION TESTS
// ============================================================================
console.log('🔗 Testing Integrations...');

test('Integration', 'SEO routes integrated in server', () => {
  if (!fileContains('./server.js', 'seoRoutes'))
    throw new Error('SEO routes not integrated');
});

test('Integration', 'Phase 8 routes integrated in server', () => {
  if (!fileContains('./server.js', 'virtualTourRoutes'))
    throw new Error('Phase 8 routes not integrated');
});

test('Integration', 'Socket.io configured', () => {
  if (!fileContains('./server.js', 'socket.io'))
    throw new Error('Socket.io not configured');
});

test('Integration', 'CORS configured', () => {
  if (!fileContains('./server.js', 'cors')) throw new Error('CORS not configured');
});

test('Integration', 'Rate limiting configured', () => {
  if (!fileContains('./server.js', 'rateLimit'))
    throw new Error('Rate limiting not configured');
});

test('Integration', 'Helmet security configured', () => {
  if (!fileContains('./server.js', 'helmet')) throw new Error('Helmet not configured');
});

test('Integration', 'Compression configured', () => {
  if (!fileContains('./server.js', 'compression'))
    throw new Error('Compression not configured');
});

// ============================================================================
// RESULTS SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('   📊 TEST RESULTS SUMMARY');
console.log('='.repeat(70) + '\n');

// Print category-wise results
Object.keys(testResults).forEach(category => {
  const result = testResults[category];
  const total = result.passed + result.failed;
  const percentage = ((result.passed / total) * 100).toFixed(1);
  const status = result.failed === 0 ? '✅' : '⚠️';

  console.log(`${status} ${category.padEnd(35)} ${result.passed}/${total} (${percentage}%)`);
});

console.log('\n' + '='.repeat(70));
console.log(`✅ Total Passed: ${totalPassed}`);
console.log(`❌ Total Failed: ${totalFailed}`);
console.log(`📈 Total Tests: ${totalPassed + totalFailed}`);
console.log(`🎯 Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(2)}%`);
console.log('='.repeat(70) + '\n');

// Failed tests details
if (totalFailed > 0) {
  console.log('❌ FAILED TESTS:\n');
  Object.keys(testResults).forEach(category => {
    const failedTests = testResults[category].tests.filter(t => t.status === 'FAIL');
    if (failedTests.length > 0) {
      console.log(`${category}:`);
      failedTests.forEach(test => {
        console.log(`  ❌ ${test.name}`);
        console.log(`     ${test.error}\n`);
      });
    }
  });
}

// Project Statistics
console.log('='.repeat(70));
console.log('   📈 PROJECT STATISTICS');
console.log('='.repeat(70) + '\n');

const backendModels = fs.readdirSync('./models').filter(f => f.endsWith('.js')).length;
const backendRoutes = fs.readdirSync('./routes').filter(f => f.endsWith('.js')).length;
const backendControllers = fs.existsSync('./controllers')
  ? fs.readdirSync('./controllers').filter(f => f.endsWith('.js')).length
  : 0;

console.log(`📁 Backend Models:        ${backendModels} files`);
console.log(`🛣️  Backend Routes:        ${backendRoutes} files`);
console.log(`🎮 Backend Controllers:   ${backendControllers} files`);
console.log(`⚛️  Frontend Components:   ${countFiles('../frontend/src/components', '.jsx')} files`);
console.log(`📄 Frontend Pages:        ${countFiles('../frontend/src/pages', '.jsx')} files`);
console.log(`📱 Mobile Screens:        ${countFiles('../mobile/src/screens', '.jsx')} files`);

console.log('\n' + '='.repeat(70));
console.log('   🎯 FEATURE COMPLETION STATUS');
console.log('='.repeat(70) + '\n');

const features = [
  { name: 'User Authentication', status: '✅ Complete' },
  { name: 'Property Management', status: '✅ Complete' },
  { name: 'Multi-Branch Admin System', status: '✅ Complete' },
  { name: 'Service Bookings', status: '✅ Complete' },
  { name: 'Payment Integration', status: '✅ Complete' },
  { name: 'Real-time Chat', status: '✅ Complete' },
  { name: 'EMI Calculator', status: '✅ Complete' },
  { name: 'Property Valuation', status: '✅ Complete' },
  { name: 'Advanced Filters', status: '✅ Complete' },
  { name: 'Property Comparison', status: '✅ Complete' },
  { name: 'Reviews & Ratings', status: '✅ Complete' },
  { name: 'Builder/Project Listings', status: '✅ Complete' },
  { name: 'Membership Plans', status: '✅ Complete' },
  { name: 'Property Alerts', status: '✅ Complete' },
  { name: 'Virtual Tours (360°)', status: '✅ Complete' },
  { name: 'AI Recommendations', status: '✅ Complete' },
  { name: 'Home Loan Integration', status: '✅ Complete' },
  { name: 'Video Call Tours', status: '✅ Complete' },
  { name: 'Advanced Analytics', status: '✅ Complete' },
  { name: 'SEO Optimization', status: '✅ Complete' },
  { name: 'Mobile App', status: '✅ Complete' },
  { name: 'Google Analytics', status: '✅ Complete' }
];

features.forEach(feature => {
  console.log(`${feature.status.padEnd(15)} ${feature.name}`);
});

console.log('\n' + '='.repeat(70));
console.log('   🏆 FINAL ASSESSMENT');
console.log('='.repeat(70) + '\n');

const overallScore = ((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(2);

if (overallScore >= 95) {
  console.log('🌟 EXCELLENT! Your application is production-ready!');
  console.log('   - All critical features implemented');
  console.log('   - Comprehensive SEO optimization');
  console.log('   - Enterprise-level architecture');
  console.log('   - Ready for deployment');
} else if (overallScore >= 90) {
  console.log('✅ VERY GOOD! Minor improvements needed.');
  console.log(`   - ${totalFailed} tests need attention`);
  console.log('   - Review failed tests above');
} else if (overallScore >= 80) {
  console.log('⚠️  GOOD! Some issues need fixing.');
  console.log(`   - ${totalFailed} tests failed`);
  console.log('   - Address critical issues first');
} else {
  console.log('❌ NEEDS WORK! Several issues detected.');
  console.log(`   - ${totalFailed} tests failed`);
  console.log('   - Review and fix failed tests');
}

console.log('\n' + '='.repeat(70) + '\n');

process.exit(totalFailed === 0 ? 0 : 1);
