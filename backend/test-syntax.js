/**
 * Syntax Validation Test
 * Validates JavaScript syntax for all Phase 8 files
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('\n=== PHASE 8 SYNTAX VALIDATION ===\n');

let passedFiles = 0;
let failedFiles = 0;

function validateSyntax(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');

    // Try to create a script context (will throw on syntax errors)
    new vm.Script(code, { filename: filePath });

    console.log(`✅ ${path.basename(filePath)} - Valid JavaScript`);
    passedFiles++;
    return true;
  } catch (error) {
    console.log(`❌ ${path.basename(filePath)} - Syntax Error`);
    console.log(`   ${error.message}\n`);
    failedFiles++;
    return false;
  }
}

console.log('📋 Backend Models:\n');
validateSyntax('./models/VirtualTour.js');
validateSyntax('./models/VideoCallTour.js');
validateSyntax('./models/AIRecommendation.js');
validateSyntax('./models/HomeLoanApplication.js');
validateSyntax('./models/PropertyAnalytics.js');

console.log('\n📋 Backend Routes:\n');
validateSyntax('./routes/virtualTourRoutes.js');
validateSyntax('./routes/videoCallTourRoutes.js');
validateSyntax('./routes/aiRecommendationRoutes.js');
validateSyntax('./routes/homeLoanRoutes.js');
validateSyntax('./routes/analyticsRoutes.js');

console.log('\n' + '='.repeat(60));
console.log('📊 SYNTAX VALIDATION SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Valid Files: ${passedFiles}`);
console.log(`❌ Invalid Files: ${failedFiles}`);
console.log(`📈 Total Files Checked: ${passedFiles + failedFiles}`);
console.log('='.repeat(60) + '\n');

if (failedFiles === 0) {
  console.log('🎉 ALL FILES HAVE VALID JAVASCRIPT SYNTAX!\n');
  process.exit(0);
} else {
  console.log('⚠️  Some files have syntax errors. Please review above.\n');
  process.exit(1);
}
