const express = require('express');
const router = express.Router();
const { PropertyAlert, Property } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get user's alerts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const alerts = await PropertyAlert.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single alert
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const alert = await PropertyAlert.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create alert
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      property_type,
      listing_type,
      min_price,
      max_price,
      min_bedrooms,
      max_bedrooms,
      regions,
      locations,
      furnishing_status,
      amenities,
      possession_status,
      posted_by,
      frequency,
      email_notifications,
      push_notifications
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Alert name is required'
      });
    }

    const alert = await PropertyAlert.create({
      user_id: req.user.id,
      name,
      property_type: property_type || [],
      listing_type: listing_type || 'any',
      min_price,
      max_price,
      min_bedrooms,
      max_bedrooms,
      regions: regions || [],
      locations: locations || [],
      furnishing_status: furnishing_status || [],
      amenities: amenities || [],
      possession_status: possession_status || [],
      posted_by: posted_by || [],
      frequency: frequency || 'daily',
      email_notifications: email_notifications !== false,
      push_notifications: push_notifications !== false
    });

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update alert
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const alert = await PropertyAlert.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    await alert.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Alert updated successfully',
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete alert
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const alert = await PropertyAlert.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    await alert.destroy();

    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Toggle alert active status
router.patch('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const alert = await PropertyAlert.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    alert.is_active = !alert.is_active;
    await alert.save();

    res.status(200).json({
      success: true,
      message: `Alert ${alert.is_active ? 'activated' : 'deactivated'}`,
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get matching properties for an alert
router.get('/:id/matches', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const alert = await PropertyAlert.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Build query based on alert criteria
    const where = { status: 'approved' };

    if (alert.property_type.length > 0) {
      where.property_type = { [Op.in]: alert.property_type };
    }

    if (alert.listing_type !== 'any') {
      where.listing_type = alert.listing_type;
    }

    if (alert.min_price || alert.max_price) {
      where.price = {};
      if (alert.min_price) where.price[Op.gte] = alert.min_price;
      if (alert.max_price) where.price[Op.lte] = alert.max_price;
    }

    if (alert.min_bedrooms || alert.max_bedrooms) {
      where.bedrooms = {};
      if (alert.min_bedrooms) where.bedrooms[Op.gte] = alert.min_bedrooms;
      if (alert.max_bedrooms) where.bedrooms[Op.lte] = alert.max_bedrooms;
    }

    if (alert.regions.length > 0) {
      where.region = { [Op.in]: alert.regions };
    }

    if (alert.locations.length > 0) {
      where.location = { [Op.in]: alert.locations };
    }

    if (alert.furnishing_status.length > 0) {
      where.furnishing_status = { [Op.in]: alert.furnishing_status };
    }

    if (alert.possession_status.length > 0) {
      where.possession_status = { [Op.in]: alert.possession_status };
    }

    if (alert.posted_by.length > 0) {
      where.posted_by = { [Op.in]: alert.posted_by };
    }

    const { count, rows: properties } = await Property.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Check new matches for all active alerts (cron job endpoint)
router.post('/check-all', authenticateToken, async (req, res) => {
  try {
    // Only allow super admin to trigger this
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can trigger alert checks'
      });
    }

    const alerts = await PropertyAlert.findAll({
      where: { is_active: true }
    });

    const results = [];

    for (const alert of alerts) {
      // Build query (same logic as matches endpoint)
      const where = {
        status: 'approved',
        created_at: {
          [Op.gte]: alert.last_notified_at || alert.created_at
        }
      };

      // Apply filters...
      if (alert.property_type.length > 0) {
        where.property_type = { [Op.in]: alert.property_type };
      }

      const newMatches = await Property.count({ where });

      if (newMatches > 0) {
        alert.matched_count += newMatches;
        alert.last_notified_at = new Date();
        await alert.save();

        results.push({
          alert_id: alert.id,
          user_id: alert.user_id,
          new_matches: newMatches
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Alert check completed',
      data: {
        alerts_checked: alerts.length,
        alerts_triggered: results.length,
        results
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
