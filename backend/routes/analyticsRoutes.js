const express = require('express');
const router = express.Router();
const { PropertyAnalytics, Property, User, Lead, SiteVisit, VirtualTour, VideoCallTour, Shortlist, RecentlyViewed } = require('../models');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

// @route   GET /api/analytics/property/:propertyId
// @desc    Get analytics for a specific property
// @access  Private (Property owner or admin)
router.get('/property/:propertyId', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const property = await Property.findByPk(req.params.propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check authorization
    if (property.user_id !== req.user.id && req.user.role !== 'super_admin' && req.user.role !== 'branch_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const whereClause = { property_id: req.params.propertyId };

    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else {
      // Default to last 30 days
      whereClause.date = {
        [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      };
    }

    const analytics = await PropertyAnalytics.findAll({
      where: whereClause,
      order: [['date', 'ASC']]
    });

    // Calculate summary statistics
    const summary = {
      total_views: 0,
      total_unique_viewers: 0,
      total_shortlists: 0,
      total_contacts: 0,
      total_shares: 0,
      total_virtual_tour_views: 0,
      total_video_call_requests: 0,
      total_site_visit_requests: 0,
      avg_time_on_page: 0,
      avg_bounce_rate: 0,
      avg_conversion_rate: 0
    };

    analytics.forEach(record => {
      summary.total_views += record.views;
      summary.total_unique_viewers += record.unique_viewers;
      summary.total_shortlists += record.shortlists;
      summary.total_contacts += record.contacts;
      summary.total_shares += record.shares;
      summary.total_virtual_tour_views += record.virtual_tour_views;
      summary.total_video_call_requests += record.video_call_requests;
      summary.total_site_visit_requests += record.site_visit_requests;
      summary.avg_time_on_page += record.avg_time_on_page;
      summary.avg_bounce_rate += parseFloat(record.bounce_rate);
      summary.avg_conversion_rate += parseFloat(record.conversion_rate);
    });

    if (analytics.length > 0) {
      summary.avg_time_on_page = Math.round(summary.avg_time_on_page / analytics.length);
      summary.avg_bounce_rate = (summary.avg_bounce_rate / analytics.length).toFixed(2);
      summary.avg_conversion_rate = (summary.avg_conversion_rate / analytics.length).toFixed(2);
    }

    // Aggregate traffic sources
    const trafficSources = {};
    const deviceBreakdown = {};
    const locationBreakdown = {};

    analytics.forEach(record => {
      // Traffic sources
      Object.entries(record.traffic_sources || {}).forEach(([source, count]) => {
        trafficSources[source] = (trafficSources[source] || 0) + count;
      });

      // Device breakdown
      Object.entries(record.device_breakdown || {}).forEach(([device, count]) => {
        deviceBreakdown[device] = (deviceBreakdown[device] || 0) + count;
      });

      // Location breakdown
      Object.entries(record.location_breakdown || {}).forEach(([location, count]) => {
        locationBreakdown[location] = (locationBreakdown[location] || 0) + count;
      });
    });

    res.json({
      success: true,
      data: {
        property_id: req.params.propertyId,
        date_range: {
          start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: endDate || new Date()
        },
        summary,
        daily_analytics: analytics,
        traffic_sources: trafficSources,
        device_breakdown: deviceBreakdown,
        location_breakdown: locationBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching property analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/analytics/track-view
// @desc    Track property view
// @access  Public
router.post('/track-view', async (req, res) => {
  try {
    const {
      property_id,
      user_id,
      duration,
      source,
      device,
      location
    } = req.body;

    if (!property_id) {
      return res.status(400).json({
        success: false,
        message: 'Property ID is required'
      });
    }

    const today = new Date().toISOString().split('T')[0];

    // Find or create analytics record for today
    let [analytics, created] = await PropertyAnalytics.findOrCreate({
      where: {
        property_id,
        date: today
      },
      defaults: {
        property_id,
        date: today,
        views: 0,
        unique_viewers: 0,
        avg_time_on_page: 0,
        traffic_sources: {},
        device_breakdown: {},
        location_breakdown: {}
      }
    });

    // Update analytics
    const updates = {
      views: analytics.views + 1,
      avg_time_on_page: duration ?
        Math.round((analytics.avg_time_on_page * analytics.views + duration) / (analytics.views + 1)) :
        analytics.avg_time_on_page
    };

    // Update traffic sources
    if (source) {
      const trafficSources = analytics.traffic_sources || {};
      trafficSources[source] = (trafficSources[source] || 0) + 1;
      updates.traffic_sources = trafficSources;
    }

    // Update device breakdown
    if (device) {
      const deviceBreakdown = analytics.device_breakdown || {};
      deviceBreakdown[device] = (deviceBreakdown[device] || 0) + 1;
      updates.device_breakdown = deviceBreakdown;
    }

    // Update location breakdown
    if (location) {
      const locationBreakdown = analytics.location_breakdown || {};
      locationBreakdown[location] = (locationBreakdown[location] || 0) + 1;
      updates.location_breakdown = locationBreakdown;
    }

    // Track unique viewer if user_id provided
    if (user_id && !created) {
      // Check if this user viewed today
      const viewedToday = await RecentlyViewed.findOne({
        where: {
          user_id,
          property_id,
          viewed_at: {
            [Op.gte]: new Date(today)
          }
        }
      });

      if (!viewedToday) {
        updates.unique_viewers = analytics.unique_viewers + 1;
      }
    } else if (created && user_id) {
      updates.unique_viewers = 1;
    }

    await analytics.update(updates);

    // Update property views count
    await Property.increment('views_count', { where: { id: property_id } });

    res.json({
      success: true,
      message: 'View tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/analytics/track-action
// @desc    Track user action (shortlist, contact, share, etc.)
// @access  Public
router.post('/track-action', async (req, res) => {
  try {
    const { property_id, action_type } = req.body;

    if (!property_id || !action_type) {
      return res.status(400).json({
        success: false,
        message: 'Property ID and action type are required'
      });
    }

    const today = new Date().toISOString().split('T')[0];

    let [analytics] = await PropertyAnalytics.findOrCreate({
      where: {
        property_id,
        date: today
      },
      defaults: {
        property_id,
        date: today,
        views: 0
      }
    });

    const updates = {};

    switch (action_type) {
      case 'shortlist':
        updates.shortlists = analytics.shortlists + 1;
        break;
      case 'contact':
        updates.contacts = analytics.contacts + 1;
        await Property.increment('contact_count', { where: { id: property_id } });
        break;
      case 'share':
        updates.shares = analytics.shares + 1;
        break;
      case 'virtual_tour':
        updates.virtual_tour_views = analytics.virtual_tour_views + 1;
        break;
      case 'video_call':
        updates.video_call_requests = analytics.video_call_requests + 1;
        break;
      case 'site_visit':
        updates.site_visit_requests = analytics.site_visit_requests + 1;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action type'
        });
    }

    // Calculate conversion rate if there are views
    if (analytics.views > 0 && action_type === 'contact') {
      updates.conversion_rate = ((analytics.contacts + 1) / analytics.views * 100).toFixed(2);
    }

    await analytics.update(updates);

    res.json({
      success: true,
      message: 'Action tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking action:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/dashboard
// @desc    Get overview analytics dashboard for user's properties
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    // Get user's properties
    const properties = await Property.findAll({
      where: { user_id: req.user.id },
      attributes: ['id', 'title', 'property_type', 'price', 'location', 'views_count', 'contact_count', 'shortlist_count', 'created_at']
    });

    if (properties.length === 0) {
      return res.json({
        success: true,
        data: {
          total_properties: 0,
          total_views: 0,
          total_contacts: 0,
          total_shortlists: 0,
          properties_performance: []
        }
      });
    }

    const propertyIds = properties.map(p => p.id);

    // Get analytics for last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const analytics = await PropertyAnalytics.findAll({
      where: {
        property_id: { [Op.in]: propertyIds },
        date: { [Op.gte]: thirtyDaysAgo }
      },
      attributes: [
        'property_id',
        [sequelize.fn('SUM', sequelize.col('views')), 'total_views'],
        [sequelize.fn('SUM', sequelize.col('unique_viewers')), 'total_unique_viewers'],
        [sequelize.fn('SUM', sequelize.col('contacts')), 'total_contacts'],
        [sequelize.fn('SUM', sequelize.col('shortlists')), 'total_shortlists'],
        [sequelize.fn('SUM', sequelize.col('shares')), 'total_shares'],
        [sequelize.fn('AVG', sequelize.col('avg_time_on_page')), 'avg_time'],
        [sequelize.fn('AVG', sequelize.col('conversion_rate')), 'avg_conversion']
      ],
      group: ['property_id'],
      raw: true
    });

    // Create analytics map
    const analyticsMap = {};
    analytics.forEach(a => {
      analyticsMap[a.property_id] = {
        views: parseInt(a.total_views) || 0,
        unique_viewers: parseInt(a.total_unique_viewers) || 0,
        contacts: parseInt(a.total_contacts) || 0,
        shortlists: parseInt(a.total_shortlists) || 0,
        shares: parseInt(a.total_shares) || 0,
        avg_time: Math.round(parseFloat(a.avg_time)) || 0,
        conversion_rate: parseFloat(a.avg_conversion)?.toFixed(2) || '0.00'
      };
    });

    // Combine property data with analytics
    const propertiesPerformance = properties.map(p => ({
      id: p.id,
      title: p.title,
      property_type: p.property_type,
      price: p.price,
      location: p.location,
      created_at: p.created_at,
      lifetime: {
        views: p.views_count,
        contacts: p.contact_count,
        shortlists: p.shortlist_count
      },
      last_30_days: analyticsMap[p.id] || {
        views: 0,
        unique_viewers: 0,
        contacts: 0,
        shortlists: 0,
        shares: 0,
        avg_time: 0,
        conversion_rate: '0.00'
      }
    }));

    // Calculate totals
    const totals = {
      total_properties: properties.length,
      total_views: properties.reduce((sum, p) => sum + p.views_count, 0),
      total_contacts: properties.reduce((sum, p) => sum + p.contact_count, 0),
      total_shortlists: properties.reduce((sum, p) => sum + p.shortlist_count, 0),
      last_30_days: {
        views: Object.values(analyticsMap).reduce((sum, a) => sum + a.views, 0),
        contacts: Object.values(analyticsMap).reduce((sum, a) => sum + a.contacts, 0),
        shortlists: Object.values(analyticsMap).reduce((sum, a) => sum + a.shortlists, 0),
        shares: Object.values(analyticsMap).reduce((sum, a) => sum + a.shares, 0)
      }
    };

    // Get top performing property
    const topProperty = propertiesPerformance.sort((a, b) =>
      b.last_30_days.views - a.last_30_days.views
    )[0];

    res.json({
      success: true,
      data: {
        totals,
        top_property: topProperty,
        properties_performance: propertiesPerformance
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/market-insights
// @desc    Get market insights and trends
// @access  Public
router.get('/market-insights', async (req, res) => {
  try {
    const { region, property_type, days = 30 } = req.query;

    const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const whereClause = {
      status: 'approved',
      is_active: true,
      created_at: { [Op.gte]: dateFrom }
    };

    if (region) whereClause.region = region;
    if (property_type) whereClause.property_type = property_type;

    // Get properties with analytics
    const properties = await Property.findAll({
      where: whereClause,
      attributes: [
        'property_type',
        'listing_type',
        'location',
        'region',
        [sequelize.fn('AVG', sequelize.col('price')), 'avg_price'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('views_count')), 'avg_views'],
        [sequelize.fn('AVG', sequelize.col('contact_count')), 'avg_contacts']
      ],
      group: ['property_type', 'listing_type', 'location', 'region'],
      raw: true
    });

    // Popular locations
    const popularLocations = await Property.findAll({
      where: { ...whereClause },
      attributes: [
        'location',
        'region',
        [sequelize.fn('COUNT', sequelize.col('id')), 'property_count'],
        [sequelize.fn('AVG', sequelize.col('price')), 'avg_price'],
        [sequelize.fn('AVG', sequelize.col('views_count')), 'avg_views']
      ],
      group: ['location', 'region'],
      order: [[sequelize.literal('property_count'), 'DESC']],
      limit: 10,
      raw: true
    });

    res.json({
      success: true,
      data: {
        market_overview: properties,
        popular_locations: popularLocations,
        date_range: {
          from: dateFrom,
          to: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error fetching market insights:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
