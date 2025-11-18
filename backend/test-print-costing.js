/**
 * Print Costing Agent Test
 * This file demonstrates the print costing logic like a print expert
 */

const PrintCostingAgent = require('./models/PrintCostingAgent');

console.log('='.repeat(80));
console.log('PRINT COSTING AGENT - EXPERT LOGIC DEMONSTRATION');
console.log('='.repeat(80));
console.log();

// Test Case 1: Budget Property Brochure
console.log('TEST CASE 1: Budget Property Brochure (100 copies)');
console.log('-'.repeat(80));
const test1 = PrintCostingAgent.calculateCost({
  paperSize: 'A4',
  paperType: 'standard_80gsm',
  printType: 'color',
  quantity: 100,
  sides: 'double',
  binding: 'staple',
  lamination: 'none',
  finishing: { folding: false, punching: false, trimming: false, embossing: false },
  urgency: 'standard',
  documentType: 'property_brochure'
});

console.log('Specifications:');
console.log('  - Paper: A4, Standard 80gsm');
console.log('  - Print: Color, Double-sided');
console.log('  - Binding: Staple');
console.log('  - Quantity: 100 copies');
console.log();
console.log('Cost Breakdown:');
console.log(`  Paper Cost:     $${test1.paperCost.toFixed(2)}`);
console.log(`  Printing Cost:  $${test1.printingCost.toFixed(2)}`);
console.log(`  Binding Cost:   $${test1.bindingCost.toFixed(2)}`);
console.log(`  Finishing Cost: $${test1.finishingCost.toFixed(2)}`);
console.log(`  Subtotal:       $${test1.baseCost.toFixed(2)}`);
console.log(`  Discount (5%):  -$${test1.discountAmount.toFixed(2)}`);
console.log(`  Urgency Cost:   $${test1.urgencyCost.toFixed(2)}`);
console.log(`  TOTAL COST:     $${test1.totalCost.toFixed(2)}`);
console.log(`  Price per unit: $${test1.costBreakdown.pricePerUnit.toFixed(2)}`);
console.log();

// Test Case 2: Premium Property Brochure
console.log('TEST CASE 2: Premium Property Brochure (500 copies)');
console.log('-'.repeat(80));
const test2 = PrintCostingAgent.calculateCost({
  paperSize: 'A4',
  paperType: 'glossy_130gsm',
  printType: 'full_color_photo',
  quantity: 500,
  sides: 'double',
  binding: 'saddle_stitch',
  lamination: 'gloss',
  finishing: { folding: false, punching: false, trimming: true, embossing: false },
  urgency: 'standard',
  documentType: 'property_brochure'
});

console.log('Specifications:');
console.log('  - Paper: A4, Glossy 130gsm');
console.log('  - Print: Full Color Photo, Double-sided');
console.log('  - Binding: Saddle Stitch');
console.log('  - Lamination: Gloss');
console.log('  - Finishing: Trimming');
console.log('  - Quantity: 500 copies');
console.log();
console.log('Cost Breakdown:');
console.log(`  Paper Cost:     $${test2.paperCost.toFixed(2)}`);
console.log(`  Printing Cost:  $${test2.printingCost.toFixed(2)}`);
console.log(`  Binding Cost:   $${test2.bindingCost.toFixed(2)}`);
console.log(`  Finishing Cost: $${test2.finishingCost.toFixed(2)}`);
console.log(`  Subtotal:       $${test2.baseCost.toFixed(2)}`);
console.log(`  Discount (15%): -$${test2.discountAmount.toFixed(2)}`);
console.log(`  Urgency Cost:   $${test2.urgencyCost.toFixed(2)}`);
console.log(`  TOTAL COST:     $${test2.totalCost.toFixed(2)}`);
console.log(`  Price per unit: $${test2.costBreakdown.pricePerUnit.toFixed(2)}`);
console.log();

// Test Case 3: Urgent Marketing Flyer
console.log('TEST CASE 3: Urgent Marketing Flyers (1000 copies)');
console.log('-'.repeat(80));
const test3 = PrintCostingAgent.calculateCost({
  paperSize: 'A5',
  paperType: 'glossy_130gsm',
  printType: 'color',
  quantity: 1000,
  sides: 'single',
  binding: 'none',
  lamination: 'gloss',
  finishing: { folding: false, punching: false, trimming: false, embossing: false },
  urgency: 'same_day',
  documentType: 'marketing_flyer'
});

console.log('Specifications:');
console.log('  - Paper: A5, Glossy 130gsm');
console.log('  - Print: Color, Single-sided');
console.log('  - Lamination: Gloss');
console.log('  - Urgency: Same Day (100% surcharge)');
console.log('  - Quantity: 1000 copies');
console.log();
console.log('Cost Breakdown:');
console.log(`  Paper Cost:     $${test3.paperCost.toFixed(2)}`);
console.log(`  Printing Cost:  $${test3.printingCost.toFixed(2)}`);
console.log(`  Binding Cost:   $${test3.bindingCost.toFixed(2)}`);
console.log(`  Finishing Cost: $${test3.finishingCost.toFixed(2)}`);
console.log(`  Subtotal:       $${test3.baseCost.toFixed(2)}`);
console.log(`  Discount (20%): -$${test3.discountAmount.toFixed(2)}`);
console.log(`  Urgency Cost:   $${test3.urgencyCost.toFixed(2)} (Same Day)`);
console.log(`  TOTAL COST:     $${test3.totalCost.toFixed(2)}`);
console.log(`  Price per unit: $${test3.costBreakdown.pricePerUnit.toFixed(2)}`);
console.log();

// Test Case 4: Legal Document
console.log('TEST CASE 4: Legal Document with Binding (50 copies)');
console.log('-'.repeat(80));
const test4 = PrintCostingAgent.calculateCost({
  paperSize: 'Legal',
  paperType: 'premium_100gsm',
  printType: 'black_and_white',
  quantity: 50,
  sides: 'double',
  binding: 'spiral',
  lamination: 'none',
  finishing: { folding: false, punching: false, trimming: false, embossing: false },
  urgency: 'standard',
  documentType: 'legal_document'
});

console.log('Specifications:');
console.log('  - Paper: Legal, Premium 100gsm');
console.log('  - Print: Black & White, Double-sided');
console.log('  - Binding: Spiral');
console.log('  - Quantity: 50 copies');
console.log();
console.log('Cost Breakdown:');
console.log(`  Paper Cost:     $${test4.paperCost.toFixed(2)}`);
console.log(`  Printing Cost:  $${test4.printingCost.toFixed(2)}`);
console.log(`  Binding Cost:   $${test4.bindingCost.toFixed(2)}`);
console.log(`  Finishing Cost: $${test4.finishingCost.toFixed(2)}`);
console.log(`  Subtotal:       $${test4.baseCost.toFixed(2)}`);
console.log(`  Discount:       -$${test4.discountAmount.toFixed(2)} (No volume discount)`);
console.log(`  Urgency Cost:   $${test4.urgencyCost.toFixed(2)}`);
console.log(`  TOTAL COST:     $${test4.totalCost.toFixed(2)}`);
console.log(`  Price per unit: $${test4.costBreakdown.pricePerUnit.toFixed(2)}`);
console.log();

// Test Case 5: Luxury Brochure with All Features
console.log('TEST CASE 5: Luxury Property Portfolio (100 copies)');
console.log('-'.repeat(80));
const test5 = PrintCostingAgent.calculateCost({
  paperSize: 'A4',
  paperType: 'cardstock_250gsm',
  printType: 'full_color_photo',
  quantity: 100,
  sides: 'double',
  binding: 'hardcover',
  lamination: 'gloss',
  finishing: { folding: false, punching: false, trimming: true, embossing: true },
  urgency: 'express',
  documentType: 'property_brochure'
});

console.log('Specifications:');
console.log('  - Paper: A4, Cardstock 250gsm');
console.log('  - Print: Full Color Photo, Double-sided');
console.log('  - Binding: Hardcover');
console.log('  - Lamination: Gloss');
console.log('  - Finishing: Trimming + Embossing');
console.log('  - Urgency: Express (50% surcharge)');
console.log('  - Quantity: 100 copies');
console.log();
console.log('Cost Breakdown:');
console.log(`  Paper Cost:     $${test5.paperCost.toFixed(2)}`);
console.log(`  Printing Cost:  $${test5.printingCost.toFixed(2)}`);
console.log(`  Binding Cost:   $${test5.bindingCost.toFixed(2)}`);
console.log(`  Finishing Cost: $${test5.finishingCost.toFixed(2)}`);
console.log(`  Subtotal:       $${test5.baseCost.toFixed(2)}`);
console.log(`  Discount (5%):  -$${test5.discountAmount.toFixed(2)}`);
console.log(`  Urgency Cost:   $${test5.urgencyCost.toFixed(2)} (Express)`);
console.log(`  TOTAL COST:     $${test5.totalCost.toFixed(2)}`);
console.log(`  Price per unit: $${test5.costBreakdown.pricePerUnit.toFixed(2)}`);
console.log();

// Expert Recommendations
console.log('='.repeat(80));
console.log('EXPERT RECOMMENDATIONS');
console.log('='.repeat(80));
console.log();

const recommendations = [
  { type: 'property_brochure', qty: 100 },
  { type: 'contract_document', qty: 50 },
  { type: 'marketing_flyer', qty: 500 },
  { type: 'floor_plan', qty: 25 }
];

recommendations.forEach(rec => {
  const expert = PrintCostingAgent.getExpertRecommendations(rec.type, rec.qty);
  console.log(`Document Type: ${rec.type.replace('_', ' ').toUpperCase()}`);
  console.log(`Quantity: ${rec.qty} copies`);
  console.log('-'.repeat(80));
  console.log(`Recommended Paper: ${expert.paperSize} - ${expert.paperType.replace('_', ' ')}`);
  console.log(`Recommended Print: ${expert.printType.replace('_', ' ')}`);
  console.log(`Recommended Sides: ${expert.sides}`);
  console.log(`Recommended Binding: ${expert.binding.replace('_', ' ')}`);
  console.log(`Recommended Lamination: ${expert.lamination}`);
  console.log();
  console.log(`Expert Reasoning: ${expert.reasoning}`);
  console.log();
});

// Volume Discount Analysis
console.log('='.repeat(80));
console.log('VOLUME DISCOUNT ANALYSIS');
console.log('='.repeat(80));
console.log();

const quantities = [50, 100, 250, 500, 1000];
console.log('Comparing costs for different quantities (A4, Color, Standard specs):');
console.log();

quantities.forEach(qty => {
  const cost = PrintCostingAgent.calculateCost({
    paperSize: 'A4',
    paperType: 'premium_100gsm',
    printType: 'color',
    quantity: qty,
    sides: 'double',
    binding: 'staple',
    lamination: 'none',
    finishing: { folding: false, punching: false, trimming: false, embossing: false },
    urgency: 'standard',
    documentType: 'property_brochure'
  });

  console.log(`${qty.toString().padStart(4)} copies: $${cost.totalCost.toFixed(2).padStart(8)} total | $${cost.costBreakdown.pricePerUnit.toFixed(2).padStart(5)} per unit | ${cost.costBreakdown.discount.percentage}% discount`);
});

console.log();
console.log('='.repeat(80));
console.log('ANALYSIS COMPLETE - Print Costing Agent is working like a print expert!');
console.log('='.repeat(80));
