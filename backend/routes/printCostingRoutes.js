const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const printCostingController = require('../controllers/printCostingController');

// Public route - Calculate print cost (no auth required for quick quotes)
router.post('/calculate', printCostingController.calculatePrintCost);

// Public route - Compare print options
router.post('/compare', printCostingController.comparePrintOptions);

// Protected routes - Require authentication
router.use(protect);

// Create a quote (save to database)
router.post('/quote', printCostingController.createQuote);

// Get user's quotes
router.get('/quotes', printCostingController.getUserQuotes);

// Get specific quote by ID
router.get('/quote/:id', printCostingController.getQuoteById);

// Update quote status
router.patch('/quote/:id/status', printCostingController.updateQuoteStatus);

// Get cost optimization suggestions
router.post('/optimize', printCostingController.getCostOptimization);

// Get printing statistics
router.get('/stats', printCostingController.getPrintingStats);

module.exports = router;
