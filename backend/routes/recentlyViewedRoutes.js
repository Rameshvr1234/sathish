const express = require('express');
const router = express.Router();
const { RecentlyViewed, Property, PropertyImage, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get user's recently viewed properties
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const recentlyViewed = await RecentlyViewed.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Property,
          as: 'property',
          include: [
            {
              model: PropertyImage,
              as: 'images',
              limit: 1
            }
          ]
        }
      ],
      order: [['viewed_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: recentlyViewed
    });
  } catch (error) {
    console.error('Error fetching recently viewed:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Track property view
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { property_id } = req.body;

    if (!property_id) {
      return res.status(400).json({
        success: false,
        message: 'Property ID is required'
      });
    }

    // Check if property exists
    const property = await Property.findByPk(property_id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Update or create recently viewed entry
    const [recentView, created] = await RecentlyViewed.upsert({
      user_id: req.user.id,
      property_id: property_id,
      viewed_at: new Date()
    }, {
      returning: true
    });

    // Keep only last 50 viewed properties per user
    const allViews = await RecentlyViewed.findAll({
      where: { user_id: req.user.id },
      order: [['viewed_at', 'DESC']]
    });

    if (allViews.length > 50) {
      const toDelete = allViews.slice(50).map(v => v.id);
      await RecentlyViewed.destroy({
        where: { id: toDelete }
      });
    }

    res.status(created ? 201 : 200).json({
      success: true,
      message: 'Property view tracked',
      data: recentView
    });
  } catch (error) {
    console.error('Error tracking property view:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Clear recently viewed history
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    await RecentlyViewed.destroy({
      where: { user_id: req.user.id }
    });

    res.status(200).json({
      success: true,
      message: 'Recently viewed history cleared'
    });
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete specific recently viewed item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await RecentlyViewed.destroy({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Recently viewed item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recently viewed item deleted'
    });
  } catch (error) {
    console.error('Error deleting recently viewed item:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
