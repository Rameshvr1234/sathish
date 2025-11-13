const express = require('express');
const router = express.Router();
const { PremiumMembership, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get membership plans
router.get('/plans', (req, res) => {
  try {
    const plans = [
      {
        id: 'basic',
        name: 'MB Basic',
        description: 'Perfect for individual sellers',
        monthly: 999,
        quarterly: 2499,
        yearly: 8999,
        features: {
          property_limit: 5,
          featured_listing_limit: 1,
          lead_access: true,
          analytics_access: false,
          priority_support: false,
          zero_brokerage: false,
          contact_limit: 50,
          validity_days: 30
        },
        highlights: [
          'Post up to 5 properties',
          '1 Featured listing',
          'Basic lead access',
          'Email support'
        ]
      },
      {
        id: 'pro',
        name: 'MB Pro',
        description: 'Best for professional agents',
        monthly: 2999,
        quarterly: 7999,
        yearly: 27999,
        popular: true,
        features: {
          property_limit: 25,
          featured_listing_limit: 5,
          lead_access: true,
          analytics_access: true,
          priority_support: true,
          zero_brokerage: true,
          contact_limit: 250,
          validity_days: 30
        },
        highlights: [
          'Post up to 25 properties',
          '5 Featured listings',
          'Direct owner contact (Zero Brokerage)',
          'Advanced analytics',
          'Priority support',
          'Verified badge'
        ]
      },
      {
        id: 'enterprise',
        name: 'MB Enterprise',
        description: 'For builders and large agencies',
        monthly: 9999,
        quarterly: 27999,
        yearly: 99999,
        features: {
          property_limit: 100,
          featured_listing_limit: 20,
          lead_access: true,
          analytics_access: true,
          priority_support: true,
          zero_brokerage: true,
          contact_limit: 1000,
          validity_days: 30,
          dedicated_manager: true,
          api_access: true,
          bulk_upload: true
        },
        highlights: [
          'Post up to 100 properties',
          '20 Featured listings',
          'Unlimited owner contacts',
          'Advanced analytics & reports',
          'Dedicated account manager',
          'API access',
          'Bulk upload',
          'Priority support 24/7'
        ]
      }
    ];

    res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's active membership
router.get('/my-membership', authenticateToken, async (req, res) => {
  try {
    const membership = await PremiumMembership.findOne({
      where: {
        user_id: req.user.id,
        status: 'active',
        end_date: { [Op.gte]: new Date() }
      },
      order: [['created_at', 'DESC']]
    });

    if (!membership) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No active membership'
      });
    }

    res.status(200).json({
      success: true,
      data: membership
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's membership history
router.get('/my-history', authenticateToken, async (req, res) => {
  try {
    const memberships = await PremiumMembership.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: memberships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Subscribe to a plan
router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { plan_type, billing_cycle, payment_id, razorpay_subscription_id } = req.body;

    if (!plan_type || !billing_cycle) {
      return res.status(400).json({
        success: false,
        message: 'Please provide plan_type and billing_cycle'
      });
    }

    // Check if user already has an active membership
    const existingMembership = await PremiumMembership.findOne({
      where: {
        user_id: req.user.id,
        status: 'active',
        end_date: { [Op.gte]: new Date() }
      }
    });

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active membership'
      });
    }

    // Define plan details
    const planDetails = {
      basic: {
        monthly: { amount: 999, property_limit: 5, featured_listing_limit: 1 },
        quarterly: { amount: 2499, property_limit: 5, featured_listing_limit: 1 },
        yearly: { amount: 8999, property_limit: 5, featured_listing_limit: 1 }
      },
      pro: {
        monthly: { amount: 2999, property_limit: 25, featured_listing_limit: 5 },
        quarterly: { amount: 7999, property_limit: 25, featured_listing_limit: 5 },
        yearly: { amount: 27999, property_limit: 25, featured_listing_limit: 5 }
      },
      enterprise: {
        monthly: { amount: 9999, property_limit: 100, featured_listing_limit: 20 },
        quarterly: { amount: 27999, property_limit: 100, featured_listing_limit: 20 },
        yearly: { amount: 99999, property_limit: 100, featured_listing_limit: 20 }
      }
    };

    const plan = planDetails[plan_type]?.[billing_cycle];

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan or billing cycle'
      });
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();

    switch (billing_cycle) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    // Create membership
    const membership = await PremiumMembership.create({
      user_id: req.user.id,
      plan_type,
      plan_name: `MB ${plan_type.charAt(0).toUpperCase() + plan_type.slice(1)}`,
      billing_cycle,
      amount: plan.amount,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
      property_limit: plan.property_limit,
      featured_listing_limit: plan.featured_listing_limit,
      lead_access: true,
      analytics_access: plan_type !== 'basic',
      priority_support: plan_type !== 'basic',
      zero_brokerage: plan_type !== 'basic',
      payment_id,
      razorpay_subscription_id
    });

    res.status(201).json({
      success: true,
      message: 'Subscription successful',
      data: membership
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Cancel subscription
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    const { reason } = req.body;

    const membership = await PremiumMembership.findOne({
      where: {
        user_id: req.user.id,
        status: 'active'
      }
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'No active membership found'
      });
    }

    membership.status = 'cancelled';
    membership.auto_renewal = false;
    membership.cancelled_at = new Date();
    membership.cancellation_reason = reason;
    await membership.save();

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: membership
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Renew subscription
router.post('/renew', authenticateToken, async (req, res) => {
  try {
    const { payment_id } = req.body;

    const oldMembership = await PremiumMembership.findOne({
      where: {
        user_id: req.user.id,
        status: { [Op.in]: ['active', 'expired'] }
      },
      order: [['created_at', 'DESC']]
    });

    if (!oldMembership) {
      return res.status(404).json({
        success: false,
        message: 'No previous membership found'
      });
    }

    // Create new membership with same plan
    const startDate = new Date();
    const endDate = new Date();

    switch (oldMembership.billing_cycle) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    const newMembership = await PremiumMembership.create({
      user_id: req.user.id,
      plan_type: oldMembership.plan_type,
      plan_name: oldMembership.plan_name,
      billing_cycle: oldMembership.billing_cycle,
      amount: oldMembership.amount,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
      property_limit: oldMembership.property_limit,
      featured_listing_limit: oldMembership.featured_listing_limit,
      lead_access: oldMembership.lead_access,
      analytics_access: oldMembership.analytics_access,
      priority_support: oldMembership.priority_support,
      zero_brokerage: oldMembership.zero_brokerage,
      payment_id
    });

    res.status(201).json({
      success: true,
      message: 'Subscription renewed successfully',
      data: newMembership
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Check membership features usage
router.get('/usage', authenticateToken, async (req, res) => {
  try {
    const membership = await PremiumMembership.findOne({
      where: {
        user_id: req.user.id,
        status: 'active',
        end_date: { [Op.gte]: new Date() }
      }
    });

    if (!membership) {
      return res.status(200).json({
        success: true,
        data: {
          hasMembership: false,
          message: 'No active membership'
        }
      });
    }

    const usage = {
      hasMembership: true,
      plan: membership.plan_type,
      properties: {
        limit: membership.property_limit,
        used: membership.properties_posted,
        remaining: membership.property_limit - membership.properties_posted
      },
      featuredListings: {
        limit: membership.featured_listing_limit,
        used: membership.featured_listings_used,
        remaining: membership.featured_listing_limit - membership.featured_listings_used
      },
      validUntil: membership.end_date,
      daysRemaining: Math.ceil((membership.end_date - new Date()) / (1000 * 60 * 60 * 24)),
      autoRenewal: membership.auto_renewal
    };

    res.status(200).json({
      success: true,
      data: usage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Admin: Get all memberships
router.get('/all', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can view all memberships'
      });
    }

    const { page = 1, limit = 20, status, plan_type } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (plan_type) where.plan_type = plan_type;

    const { count, rows: memberships } = await PremiumMembership.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'phone']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: memberships,
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

// Cron job: Check expired memberships
router.post('/check-expiry', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can trigger expiry checks'
      });
    }

    const expiredMemberships = await PremiumMembership.findAll({
      where: {
        status: 'active',
        end_date: { [Op.lt]: new Date() }
      }
    });

    for (const membership of expiredMemberships) {
      membership.status = 'expired';
      await membership.save();
    }

    res.status(200).json({
      success: true,
      message: 'Expiry check completed',
      data: {
        expired_count: expiredMemberships.length
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
