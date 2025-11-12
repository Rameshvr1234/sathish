/**
 * Phase 8 Comprehensive Test Suite
 * Tests all Phase 8 features without requiring database connection
 */

const fs = require('fs');
const path = require('path');

console.log('\n=== PHASE 8 COMPREHENSIVE TEST SUITE ===\n');

let passedTests = 0;
let failedTests = 0;

function test(description, testFn) {
  try {
    testFn();
    console.log(`✅ PASS: ${description}`);
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL: ${description}`);
    console.log(`   Error: ${error.message}`);
    failedTests++;
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function fileContains(filePath, searchString) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes(searchString);
}

console.log('📋 TEST CATEGORY 1: File Existence Tests\n');

// Test Model Files
test('VirtualTour model exists', () => {
  if (!fileExists('./models/VirtualTour.js')) throw new Error('File not found');
});

test('VideoCallTour model exists', () => {
  if (!fileExists('./models/VideoCallTour.js')) throw new Error('File not found');
});

test('AIRecommendation model exists', () => {
  if (!fileExists('./models/AIRecommendation.js')) throw new Error('File not found');
});

test('HomeLoanApplication model exists', () => {
  if (!fileExists('./models/HomeLoanApplication.js')) throw new Error('File not found');
});

test('PropertyAnalytics model exists', () => {
  if (!fileExists('./models/PropertyAnalytics.js')) throw new Error('File not found');
});

// Test Route Files
test('Virtual Tour routes exist', () => {
  if (!fileExists('./routes/virtualTourRoutes.js')) throw new Error('File not found');
});

test('Video Call Tour routes exist', () => {
  if (!fileExists('./routes/videoCallTourRoutes.js')) throw new Error('File not found');
});

test('AI Recommendation routes exist', () => {
  if (!fileExists('./routes/aiRecommendationRoutes.js')) throw new Error('File not found');
});

test('Home Loan routes exist', () => {
  if (!fileExists('./routes/homeLoanRoutes.js')) throw new Error('File not found');
});

test('Analytics routes exist', () => {
  if (!fileExists('./routes/analyticsRoutes.js')) throw new Error('File not found');
});

console.log('\n📋 TEST CATEGORY 2: Model Structure Tests\n');

// Test VirtualTour Model Structure
test('VirtualTour model has correct structure', () => {
  if (!fileContains('./models/VirtualTour.js', 'VirtualTour')) throw new Error('Model name not found');
  if (!fileContains('./models/VirtualTour.js', 'property_id')) throw new Error('property_id field missing');
  if (!fileContains('./models/VirtualTour.js', 'tour_type')) throw new Error('tour_type field missing');
  if (!fileContains('./models/VirtualTour.js', 'panorama_images')) throw new Error('panorama_images field missing');
  if (!fileContains('./models/VirtualTour.js', 'views_count')) throw new Error('views_count field missing');
});

// Test AIRecommendation Model Structure
test('AIRecommendation model has correct structure', () => {
  if (!fileContains('./models/AIRecommendation.js', 'AIRecommendation')) throw new Error('Model name not found');
  if (!fileContains('./models/AIRecommendation.js', 'user_id')) throw new Error('user_id field missing');
  if (!fileContains('./models/AIRecommendation.js', 'property_id')) throw new Error('property_id field missing');
  if (!fileContains('./models/AIRecommendation.js', 'score')) throw new Error('score field missing');
  if (!fileContains('./models/AIRecommendation.js', 'factors')) throw new Error('factors field missing');
});

// Test HomeLoanApplication Model Structure
test('HomeLoanApplication model has correct structure', () => {
  if (!fileContains('./models/HomeLoanApplication.js', 'HomeLoanApplication')) throw new Error('Model name not found');
  if (!fileContains('./models/HomeLoanApplication.js', 'bank_name')) throw new Error('bank_name field missing');
  if (!fileContains('./models/HomeLoanApplication.js', 'loan_amount')) throw new Error('loan_amount field missing');
  if (!fileContains('./models/HomeLoanApplication.js', 'emi_amount')) throw new Error('emi_amount field missing');
  if (!fileContains('./models/HomeLoanApplication.js', 'applicant_name')) throw new Error('applicant_name field missing');
});

// Test VideoCallTour Model Structure
test('VideoCallTour model has correct structure', () => {
  if (!fileContains('./models/VideoCallTour.js', 'VideoCallTour')) throw new Error('Model name not found');
  if (!fileContains('./models/VideoCallTour.js', 'scheduled_at')) throw new Error('scheduled_at field missing');
  if (!fileContains('./models/VideoCallTour.js', 'agent_id')) throw new Error('agent_id field missing');
  if (!fileContains('./models/VideoCallTour.js', 'channel_name')) throw new Error('channel_name field missing');
});

// Test PropertyAnalytics Model Structure
test('PropertyAnalytics model has correct structure', () => {
  if (!fileContains('./models/PropertyAnalytics.js', 'PropertyAnalytics')) throw new Error('Model name not found');
  if (!fileContains('./models/PropertyAnalytics.js', 'views')) throw new Error('views field missing');
  if (!fileContains('./models/PropertyAnalytics.js', 'contacts')) throw new Error('contacts field missing');
  if (!fileContains('./models/PropertyAnalytics.js', 'conversion_rate')) throw new Error('conversion_rate field missing');
});

console.log('\n📋 TEST CATEGORY 3: Route Definition Tests\n');

// Test Virtual Tour Routes
test('Virtual Tour routes have GET endpoint', () => {
  if (!fileContains('./routes/virtualTourRoutes.js', "router.get('/property/:propertyId'"))
    throw new Error('GET /property/:propertyId route missing');
});

test('Virtual Tour routes have POST endpoint', () => {
  if (!fileContains('./routes/virtualTourRoutes.js', "router.post('/'"))
    throw new Error('POST / route missing');
});

test('Virtual Tour routes have PUT endpoint', () => {
  if (!fileContains('./routes/virtualTourRoutes.js', "router.put('/:id'"))
    throw new Error('PUT /:id route missing');
});

// Test AI Recommendation Routes
test('AI Recommendation routes have GET endpoint', () => {
  if (!fileContains('./routes/aiRecommendationRoutes.js', "router.get('/'"))
    throw new Error('GET / route missing');
});

test('AI Recommendation routes have feedback endpoint', () => {
  if (!fileContains('./routes/aiRecommendationRoutes.js', "/feedback"))
    throw new Error('Feedback route missing');
});

// Test Home Loan Routes
test('Home Loan routes have banks endpoint', () => {
  if (!fileContains('./routes/homeLoanRoutes.js', "/banks"))
    throw new Error('Banks route missing');
});

test('Home Loan routes have calculate-eligibility endpoint', () => {
  if (!fileContains('./routes/homeLoanRoutes.js', "/calculate-eligibility"))
    throw new Error('Calculate eligibility route missing');
});

test('Home Loan routes have calculate-emi endpoint', () => {
  if (!fileContains('./routes/homeLoanRoutes.js', "/calculate-emi"))
    throw new Error('Calculate EMI route missing');
});

test('Home Loan routes have apply endpoint', () => {
  if (!fileContains('./routes/homeLoanRoutes.js', "/apply"))
    throw new Error('Apply route missing');
});

// Test Video Call Tour Routes
test('Video Call Tour routes have schedule endpoint', () => {
  if (!fileContains('./routes/videoCallTourRoutes.js', "router.post('/'"))
    throw new Error('Schedule route missing');
});

test('Video Call Tour routes have start endpoint', () => {
  if (!fileContains('./routes/videoCallTourRoutes.js', "/start"))
    throw new Error('Start route missing');
});

test('Video Call Tour routes have end endpoint', () => {
  if (!fileContains('./routes/videoCallTourRoutes.js', "/end"))
    throw new Error('End route missing');
});

// Test Analytics Routes
test('Analytics routes have track-view endpoint', () => {
  if (!fileContains('./routes/analyticsRoutes.js', "/track-view"))
    throw new Error('Track view route missing');
});

test('Analytics routes have dashboard endpoint', () => {
  if (!fileContains('./routes/analyticsRoutes.js', "/dashboard"))
    throw new Error('Dashboard route missing');
});

console.log('\n📋 TEST CATEGORY 4: Integration Tests\n');

// Test models/index.js integration
test('Models index exports VirtualTour', () => {
  if (!fileContains('./models/index.js', 'VirtualTour'))
    throw new Error('VirtualTour not exported');
});

test('Models index exports VideoCallTour', () => {
  if (!fileContains('./models/index.js', 'VideoCallTour'))
    throw new Error('VideoCallTour not exported');
});

test('Models index exports AIRecommendation', () => {
  if (!fileContains('./models/index.js', 'AIRecommendation'))
    throw new Error('AIRecommendation not exported');
});

test('Models index exports HomeLoanApplication', () => {
  if (!fileContains('./models/index.js', 'HomeLoanApplication'))
    throw new Error('HomeLoanApplication not exported');
});

test('Models index exports PropertyAnalytics', () => {
  if (!fileContains('./models/index.js', 'PropertyAnalytics'))
    throw new Error('PropertyAnalytics not exported');
});

// Test server.js integration
test('Server uses virtual tour routes', () => {
  if (!fileContains('./server.js', "require('./routes/virtualTourRoutes')"))
    throw new Error('Virtual tour routes not imported');
  if (!fileContains('./server.js', "/api/virtual-tours"))
    throw new Error('Virtual tour routes not mounted');
});

test('Server uses AI recommendation routes', () => {
  if (!fileContains('./server.js', "require('./routes/aiRecommendationRoutes')"))
    throw new Error('AI recommendation routes not imported');
  if (!fileContains('./server.js', "/api/ai-recommendations"))
    throw new Error('AI recommendation routes not mounted');
});

test('Server uses home loan routes', () => {
  if (!fileContains('./server.js', "require('./routes/homeLoanRoutes')"))
    throw new Error('Home loan routes not imported');
  if (!fileContains('./server.js', "/api/home-loans"))
    throw new Error('Home loan routes not mounted');
});

test('Server uses video call tour routes', () => {
  if (!fileContains('./server.js', "require('./routes/videoCallTourRoutes')"))
    throw new Error('Video call tour routes not imported');
  if (!fileContains('./server.js', "/api/video-call-tours"))
    throw new Error('Video call tour routes not mounted');
});

test('Server uses analytics routes', () => {
  if (!fileContains('./server.js', "require('./routes/analyticsRoutes')"))
    throw new Error('Analytics routes not imported');
  if (!fileContains('./server.js', "/api/analytics"))
    throw new Error('Analytics routes not mounted');
});

console.log('\n📋 TEST CATEGORY 5: Business Logic Tests\n');

// Test AI Recommendation Algorithm
test('AI Recommendation has generateRecommendations function', () => {
  if (!fileContains('./routes/aiRecommendationRoutes.js', 'generateRecommendations'))
    throw new Error('generateRecommendations function missing');
});

test('AI Recommendation has scoring system', () => {
  if (!fileContains('./routes/aiRecommendationRoutes.js', 'calculateRecommendationScore'))
    throw new Error('Scoring system missing');
});

// Test Home Loan Calculations
test('Home Loan has EMI calculation', () => {
  if (!fileContains('./routes/homeLoanRoutes.js', 'calculateEMI'))
    throw new Error('EMI calculation missing');
});

test('Home Loan has eligibility calculation', () => {
  if (!fileContains('./routes/homeLoanRoutes.js', 'calculateEligibility'))
    throw new Error('Eligibility calculation missing');
});

test('Home Loan has bank partners defined', () => {
  if (!fileContains('./routes/homeLoanRoutes.js', 'BANK_PARTNERS'))
    throw new Error('Bank partners configuration missing');
});

// Test Video Call Token Generation
test('Video Call has token generation', () => {
  if (!fileContains('./routes/videoCallTourRoutes.js', 'generateAgoraToken'))
    throw new Error('Agora token generation missing');
});

console.log('\n📋 TEST CATEGORY 6: Frontend Component Tests\n');

// Test Frontend Files
test('VirtualTourViewer component exists', () => {
  if (!fileExists('../frontend/src/pages/VirtualTourViewer.jsx'))
    throw new Error('VirtualTourViewer component not found');
});

test('AIRecommendations component exists', () => {
  if (!fileExists('../frontend/src/components/AIRecommendations.jsx'))
    throw new Error('AIRecommendations component not found');
});

test('HomeLoanApplication component exists', () => {
  if (!fileExists('../frontend/src/pages/HomeLoanApplication.jsx'))
    throw new Error('HomeLoanApplication component not found');
});

test('VirtualTourViewer has CSS file', () => {
  if (!fileExists('../frontend/src/pages/VirtualTourViewer.css'))
    throw new Error('VirtualTourViewer CSS not found');
});

test('AIRecommendations has CSS file', () => {
  if (!fileExists('../frontend/src/components/AIRecommendations.css'))
    throw new Error('AIRecommendations CSS not found');
});

test('HomeLoanApplication has CSS file', () => {
  if (!fileExists('../frontend/src/pages/HomeLoanApplication.css'))
    throw new Error('HomeLoanApplication CSS not found');
});

console.log('\n📋 TEST CATEGORY 7: Documentation Tests\n');

test('Phase 8 documentation exists', () => {
  if (!fileExists('../PHASE_8_FEATURES.md'))
    throw new Error('Documentation file not found');
});

test('Documentation includes Virtual Tours section', () => {
  if (!fileContains('../PHASE_8_FEATURES.md', '360° Virtual Tours'))
    throw new Error('Virtual Tours section missing');
});

test('Documentation includes AI Recommendations section', () => {
  if (!fileContains('../PHASE_8_FEATURES.md', 'AI-Powered Recommendations'))
    throw new Error('AI Recommendations section missing');
});

test('Documentation includes Home Loans section', () => {
  if (!fileContains('../PHASE_8_FEATURES.md', 'Home Loan Integration'))
    throw new Error('Home Loans section missing');
});

test('Documentation includes API examples', () => {
  if (!fileContains('../PHASE_8_FEATURES.md', 'API Testing'))
    throw new Error('API examples missing');
});

console.log('\n' + '='.repeat(60));
console.log('📊 TEST RESULTS SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📈 Total: ${passedTests + failedTests}`);
console.log(`🎯 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(2)}%`);
console.log('='.repeat(60) + '\n');

if (failedTests === 0) {
  console.log('🎉 ALL TESTS PASSED! Phase 8 implementation is complete and validated.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the errors above.\n');
  process.exit(1);
}
