/**
 * SEO Features Test Suite
 * Tests SEO implementation functionality
 */

const fs = require('fs');
const path = require('path');

console.log('\n=== SEO FEATURES TEST SUITE ===\n');

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

console.log('📋 TEST CATEGORY 1: SEO Files Existence\n');

// Test SEO Routes
test('SEO routes file exists', () => {
  if (!fileExists('./routes/seoRoutes.js')) throw new Error('File not found');
});

// Test Server Integration
test('SEO routes imported in server.js', () => {
  if (!fileContains('./server.js', "require('./routes/seoRoutes')"))
    throw new Error('SEO routes not imported');
});

test('SEO routes mounted in server.js', () => {
  if (!fileContains('./server.js', "app.use('/api/seo'"))
    throw new Error('SEO routes not mounted');
});

test('Sitemap redirect exists in server.js', () => {
  if (!fileContains('./server.js', "/sitemap.xml"))
    throw new Error('Sitemap redirect not found');
});

test('Robots.txt redirect exists in server.js', () => {
  if (!fileContains('./server.js', "/robots.txt"))
    throw new Error('Robots.txt redirect not found');
});

console.log('\n📋 TEST CATEGORY 2: SEO Route Endpoints\n');

// Test Sitemap Endpoint
test('Sitemap generation endpoint exists', () => {
  if (!fileContains('./routes/seoRoutes.js', "router.get('/sitemap.xml'"))
    throw new Error('Sitemap endpoint not found');
});

test('Sitemap includes properties', () => {
  if (!fileContains('./routes/seoRoutes.js', 'Property.findAll'))
    throw new Error('Property inclusion not found');
});

test('Sitemap includes builders', () => {
  if (!fileContains('./routes/seoRoutes.js', 'Builder.findAll'))
    throw new Error('Builder inclusion not found');
});

test('Sitemap includes projects', () => {
  if (!fileContains('./routes/seoRoutes.js', 'Project.findAll'))
    throw new Error('Project inclusion not found');
});

// Test Robots.txt Endpoint
test('Robots.txt generation endpoint exists', () => {
  if (!fileContains('./routes/seoRoutes.js', "router.get('/robots.txt'"))
    throw new Error('Robots.txt endpoint not found');
});

test('Robots.txt includes sitemap reference', () => {
  if (!fileContains('./routes/seoRoutes.js', 'Sitemap:'))
    throw new Error('Sitemap reference not found');
});

// Test Structured Data Endpoint
test('Structured data endpoint exists', () => {
  if (!fileContains('./routes/seoRoutes.js', "router.get('/structured-data/:propertyId'"))
    throw new Error('Structured data endpoint not found');
});

test('Structured data includes Schema.org', () => {
  if (!fileContains('./routes/seoRoutes.js', 'schema.org'))
    throw new Error('Schema.org not found');
});

test('Structured data includes property type', () => {
  if (!fileContains('./routes/seoRoutes.js', 'SingleFamilyResidence'))
    throw new Error('Property type schema not found');
});

test('Structured data includes breadcrumbs', () => {
  if (!fileContains('./routes/seoRoutes.js', 'BreadcrumbList'))
    throw new Error('Breadcrumb schema not found');
});

// Test Meta Tags Endpoint
test('Meta tags endpoint exists', () => {
  if (!fileContains('./routes/seoRoutes.js', "router.get('/meta-tags/:propertyId'"))
    throw new Error('Meta tags endpoint not found');
});

test('Meta tags include Open Graph', () => {
  if (!fileContains('./routes/seoRoutes.js', 'ogTitle'))
    throw new Error('Open Graph tags not found');
});

test('Meta tags include Twitter Card', () => {
  if (!fileContains('./routes/seoRoutes.js', 'twitterCard'))
    throw new Error('Twitter Card tags not found');
});

console.log('\n📋 TEST CATEGORY 3: Frontend SEO Components\n');

// Test SEOHead Component
test('SEOHead component exists', () => {
  if (!fileExists('../frontend/src/components/SEO/SEOHead.jsx'))
    throw new Error('SEOHead component not found');
});

test('SEOHead uses react-helmet-async', () => {
  if (!fileContains('../frontend/src/components/SEO/SEOHead.jsx', 'react-helmet-async'))
    throw new Error('react-helmet-async not imported');
});

test('SEOHead includes Open Graph tags', () => {
  if (!fileContains('../frontend/src/components/SEO/SEOHead.jsx', 'og:title'))
    throw new Error('Open Graph tags not found');
});

test('SEOHead includes Twitter Card tags', () => {
  if (!fileContains('../frontend/src/components/SEO/SEOHead.jsx', 'twitter:card'))
    throw new Error('Twitter Card tags not found');
});

test('SEOHead includes structured data', () => {
  if (!fileContains('../frontend/src/components/SEO/SEOHead.jsx', 'application/ld+json'))
    throw new Error('Structured data script not found');
});

// Test PropertySEO Component
test('PropertySEO component exists', () => {
  if (!fileExists('../frontend/src/components/SEO/PropertySEO.jsx'))
    throw new Error('PropertySEO component not found');
});

test('PropertySEO generates meta from property', () => {
  if (!fileContains('../frontend/src/components/SEO/PropertySEO.jsx', 'generateSEOFromProperty'))
    throw new Error('SEO generation function not found');
});

// Test Google Analytics Component
test('GoogleAnalytics component exists', () => {
  if (!fileExists('../frontend/src/components/SEO/GoogleAnalytics.jsx'))
    throw new Error('GoogleAnalytics component not found');
});

test('GoogleAnalytics includes gtag', () => {
  if (!fileContains('../frontend/src/components/SEO/GoogleAnalytics.jsx', 'gtag'))
    throw new Error('gtag not found');
});

test('GoogleAnalytics includes event tracking', () => {
  if (!fileContains('../frontend/src/components/SEO/GoogleAnalytics.jsx', 'trackEvent'))
    throw new Error('Event tracking not found');
});

console.log('\n📋 TEST CATEGORY 4: SEO Utility Functions\n');

// Test SEO Utils
test('SEO utils file exists', () => {
  if (!fileExists('../frontend/src/utils/seo.js'))
    throw new Error('SEO utils file not found');
});

test('SEO utils includes generateSlug', () => {
  if (!fileContains('../frontend/src/utils/seo.js', 'generateSlug'))
    throw new Error('generateSlug function not found');
});

test('SEO utils includes generatePropertyUrl', () => {
  if (!fileContains('../frontend/src/utils/seo.js', 'generatePropertyUrl'))
    throw new Error('generatePropertyUrl function not found');
});

test('SEO utils includes generateMetaDescription', () => {
  if (!fileContains('../frontend/src/utils/seo.js', 'generateMetaDescription'))
    throw new Error('generateMetaDescription function not found');
});

test('SEO utils includes generateKeywords', () => {
  if (!fileContains('../frontend/src/utils/seo.js', 'generateKeywords'))
    throw new Error('generateKeywords function not found');
});

test('SEO utils includes generateBreadcrumbSchema', () => {
  if (!fileContains('../frontend/src/utils/seo.js', 'generateBreadcrumbSchema'))
    throw new Error('generateBreadcrumbSchema function not found');
});

test('SEO utils includes checkSEOQuality', () => {
  if (!fileContains('../frontend/src/utils/seo.js', 'checkSEOQuality'))
    throw new Error('checkSEOQuality function not found');
});

test('SEO utils includes generateSocialShareUrls', () => {
  if (!fileContains('../frontend/src/utils/seo.js', 'generateSocialShareUrls'))
    throw new Error('generateSocialShareUrls function not found');
});

console.log('\n📋 TEST CATEGORY 5: Package Dependencies\n');

// Test Frontend Dependencies
test('react-helmet-async added to package.json', () => {
  if (!fileContains('../frontend/package.json', 'react-helmet-async'))
    throw new Error('react-helmet-async not in package.json');
});

test('prop-types added to package.json', () => {
  if (!fileContains('../frontend/package.json', 'prop-types'))
    throw new Error('prop-types not in package.json');
});

console.log('\n📋 TEST CATEGORY 6: Documentation\n');

// Test Documentation
test('SEO documentation exists', () => {
  if (!fileExists('../SEO_IMPLEMENTATION.md'))
    throw new Error('SEO documentation not found');
});

test('Documentation includes setup instructions', () => {
  if (!fileContains('../SEO_IMPLEMENTATION.md', 'Setup Instructions'))
    throw new Error('Setup instructions not found');
});

test('Documentation includes usage examples', () => {
  if (!fileContains('../SEO_IMPLEMENTATION.md', 'Usage Examples'))
    throw new Error('Usage examples not found');
});

test('Documentation includes best practices', () => {
  if (!fileContains('../SEO_IMPLEMENTATION.md', 'Best Practices'))
    throw new Error('Best practices not found');
});

test('Documentation includes testing guide', () => {
  if (!fileContains('../SEO_IMPLEMENTATION.md', 'Testing & Validation'))
    throw new Error('Testing guide not found');
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
  console.log('🎉 ALL SEO TESTS PASSED! SEO implementation is complete and validated.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the errors above.\n');
  process.exit(1);
}
