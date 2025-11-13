const express = require('express');
const router = express.Router();
const { calculatePropertyValuation, compareWithMarket, getLocalityStats } = require('../utils/propertyValuation');
const { authenticateToken } = require('../middleware/auth');

// Validate property details
router.post('/calculate', async (req, res) => {
  try {
    const propertyDetails = req.body;

    if (!propertyDetails.property_type || !propertyDetails.area || !propertyDetails.region || !propertyDetails.location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property_type, area, region, and location'
      });
    }

    const valuation = await calculatePropertyValuation(propertyDetails);

    res.status(200).json({
      success: true,
      data: valuation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Compare property with market
router.get('/compare/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;

    const comparison = await compareWithMarket(propertyId);

    res.status(200).json({
      success: true,
      data: comparison
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get locality statistics
router.get('/locality-stats', async (req, res) => {
  try {
    const { region, location } = req.query;

    if (!region || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide region and location'
      });
    }

    const stats = await getLocalityStats(region, location);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
