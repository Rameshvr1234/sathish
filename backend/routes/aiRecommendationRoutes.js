const express = require('express');
const router = express.Router();
const { AIRecommendation, Property, User, RecentlyViewed, Shortlist, PropertyAlert } = require('../models');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

// AI Recommendation Engine (Simplified collaborative filtering + content-based)
const generateRecommendations = async (userId) => {
  try {
    const user = await User.findByPk(userId);

    // Get user's recently viewed properties
    const recentlyViewed = await RecentlyViewed.findAll({
      where: { user_id: userId },
      include: [{ model: Property, as: 'property' }],
      limit: 20,
      order: [['viewed_at', 'DESC']]
    });

    // Get user's shortlisted properties
    const shortlisted = await Shortlist.findAll({
      where: { user_id: userId },
      include: [{ model: Property, as: 'property' }],
      limit: 20
    });

    // Get user's property alerts (preferences)
    const alerts = await PropertyAlert.findAll({
      where: {
        user_id: userId,
        is_active: true
      }
    });

    // Extract preferences from user behavior
    const preferences = extractPreferences(recentlyViewed, shortlisted, alerts);

    // Find similar properties
    const recommendations = await findSimilarProperties(preferences, userId);

    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
};

// Extract user preferences from behavior
const extractPreferences = (recentlyViewed, shortlisted, alerts) => {
  const preferences = {
    property_types: new Set(),
    price_range: { min: Infinity, max: 0 },
    locations: new Set(),
    bedrooms: new Set(),
    area_range: { min: Infinity, max: 0 },
    listing_types: new Set()
  };

  // Extract from recently viewed
  recentlyViewed.forEach(rv => {
    const p = rv.property;
    if (p) {
      preferences.property_types.add(p.property_type);
      preferences.price_range.min = Math.min(preferences.price_range.min, parseFloat(p.price) || Infinity);
      preferences.price_range.max = Math.max(preferences.price_range.max, parseFloat(p.price) || 0);
      preferences.locations.add(p.location);
      if (p.bedrooms) preferences.bedrooms.add(p.bedrooms);
      if (p.area) {
        preferences.area_range.min = Math.min(preferences.area_range.min, parseFloat(p.area) || Infinity);
        preferences.area_range.max = Math.max(preferences.area_range.max, parseFloat(p.area) || 0);
      }
      preferences.listing_types.add(p.listing_type);
    }
  });

  // Extract from shortlisted (higher weight)
  shortlisted.forEach(s => {
    const p = s.property;
    if (p) {
      preferences.property_types.add(p.property_type);
      preferences.locations.add(p.location);
      if (p.bedrooms) preferences.bedrooms.add(p.bedrooms);
      preferences.listing_types.add(p.listing_type);
    }
  });

  // Extract from alerts
  alerts.forEach(alert => {
    const criteria = alert.criteria || {};
    if (criteria.property_type) preferences.property_types.add(criteria.property_type);
    if (criteria.location) preferences.locations.add(criteria.location);
    if (criteria.min_price) preferences.price_range.min = Math.min(preferences.price_range.min, criteria.min_price);
    if (criteria.max_price) preferences.price_range.max = Math.max(preferences.price_range.max, criteria.max_price);
    if (criteria.bedrooms) preferences.bedrooms.add(criteria.bedrooms);
    if (criteria.listing_type) preferences.listing_types.add(criteria.listing_type);
  });

  return {
    property_types: Array.from(preferences.property_types),
    price_range: preferences.price_range.min !== Infinity ? preferences.price_range : null,
    locations: Array.from(preferences.locations),
    bedrooms: Array.from(preferences.bedrooms),
    area_range: preferences.area_range.min !== Infinity ? preferences.area_range : null,
    listing_types: Array.from(preferences.listing_types)
  };
};

// Find similar properties based on preferences
const findSimilarProperties = async (preferences, userId) => {
  const whereClause = {
    status: 'approved',
    is_active: true
  };

  // Build query based on preferences
  const orConditions = [];

  // Match property types
  if (preferences.property_types.length > 0) {
    orConditions.push({ property_type: { [Op.in]: preferences.property_types } });
  }

  // Match locations
  if (preferences.locations.length > 0) {
    orConditions.push({ location: { [Op.in]: preferences.locations } });
  }

  // Match listing types
  if (preferences.listing_types.length > 0) {
    orConditions.push({ listing_type: { [Op.in]: preferences.listing_types } });
  }

  // If we have any conditions, add them
  if (orConditions.length > 0) {
    whereClause[Op.or] = orConditions;
  }

  // Price range filter
  if (preferences.price_range) {
    const buffer = (preferences.price_range.max - preferences.price_range.min) * 0.2; // 20% buffer
    whereClause.price = {
      [Op.between]: [
        Math.max(0, preferences.price_range.min - buffer),
        preferences.price_range.max + buffer
      ]
    };
  }

  // Bedrooms filter
  if (preferences.bedrooms.length > 0) {
    whereClause.bedrooms = { [Op.in]: preferences.bedrooms };
  }

  // Exclude user's own properties
  whereClause.user_id = { [Op.ne]: userId };

  // Fetch properties
  const properties = await Property.findAll({
    where: whereClause,
    limit: 50,
    order: [
      ['is_featured', 'DESC'],
      ['views_count', 'DESC'],
      ['created_at', 'DESC']
    ],
    attributes: [
      'id', 'title', 'property_type', 'listing_type', 'price', 'area',
      'bedrooms', 'bathrooms', 'location', 'city', 'region', 'is_featured',
      'views_count', 'created_at'
    ]
  });

  // Calculate scores for each property
  const recommendations = properties.map(property => {
    const score = calculateRecommendationScore(property, preferences);
    const factors = calculateFactors(property, preferences);
    const reason = generateReason(property, preferences, factors);

    return {
      property_id: property.id,
      property,
      score,
      factors,
      reason
    };
  });

  // Sort by score and return top recommendations
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
};

// Calculate recommendation score (0-1)
const calculateRecommendationScore = (property, preferences) => {
  let score = 0;
  let totalWeight = 0;

  // Property type match (weight: 0.25)
  if (preferences.property_types.includes(property.property_type)) {
    score += 0.25;
  }
  totalWeight += 0.25;

  // Location match (weight: 0.20)
  if (preferences.locations.includes(property.location)) {
    score += 0.20;
  }
  totalWeight += 0.20;

  // Listing type match (weight: 0.15)
  if (preferences.listing_types.includes(property.listing_type)) {
    score += 0.15;
  }
  totalWeight += 0.15;

  // Price match (weight: 0.20)
  if (preferences.price_range) {
    const priceScore = 1 - Math.min(1,
      Math.abs(parseFloat(property.price) - (preferences.price_range.min + preferences.price_range.max) / 2) /
      (preferences.price_range.max - preferences.price_range.min)
    );
    score += 0.20 * priceScore;
  }
  totalWeight += 0.20;

  // Bedrooms match (weight: 0.10)
  if (preferences.bedrooms.includes(property.bedrooms)) {
    score += 0.10;
  }
  totalWeight += 0.10;

  // Popularity bonus (weight: 0.10)
  const popularityScore = Math.min(1, property.views_count / 100);
  score += 0.10 * popularityScore;
  totalWeight += 0.10;

  return parseFloat((score / totalWeight).toFixed(4));
};

// Calculate individual factors
const calculateFactors = (property, preferences) => {
  return {
    property_type_match: preferences.property_types.includes(property.property_type) ? 1 : 0,
    location_match: preferences.locations.includes(property.location) ? 1 : 0,
    listing_type_match: preferences.listing_types.includes(property.listing_type) ? 1 : 0,
    price_match: preferences.price_range ?
      (parseFloat(property.price) >= preferences.price_range.min &&
       parseFloat(property.price) <= preferences.price_range.max ? 1 : 0.5) : 0.5,
    bedroom_match: preferences.bedrooms.includes(property.bedrooms) ? 1 : 0.5,
    popularity: Math.min(1, property.views_count / 100)
  };
};

// Generate human-readable reason
const generateReason = (property, preferences, factors) => {
  const reasons = [];

  if (factors.property_type_match === 1) {
    reasons.push(`matches your interest in ${property.property_type.replace('_', ' ')}s`);
  }

  if (factors.location_match === 1) {
    reasons.push(`located in ${property.location} where you've been searching`);
  }

  if (factors.price_match === 1) {
    reasons.push('within your budget range');
  }

  if (factors.bedroom_match === 1) {
    reasons.push(`has ${property.bedrooms} bedrooms like your preferences`);
  }

  if (property.is_featured) {
    reasons.push('featured property');
  }

  return reasons.length > 0
    ? `This property ${reasons.join(', ')}.`
    : 'Recommended based on your browsing history.';
};

// @route   GET /api/ai-recommendations
// @desc    Get AI-powered property recommendations for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { limit = 10, refresh = false } = req.query;

    // Check if we have recent recommendations (less than 1 hour old)
    if (!refresh) {
      const recentRecommendations = await AIRecommendation.findAll({
        where: {
          user_id: req.user.id,
          created_at: {
            [Op.gte]: new Date(Date.now() - 60 * 60 * 1000) // 1 hour
          }
        },
        include: [{
          model: Property,
          as: 'property',
          where: {
            status: 'approved',
            is_active: true
          }
        }],
        order: [['score', 'DESC']],
        limit: parseInt(limit)
      });

      if (recentRecommendations.length > 0) {
        return res.json({
          success: true,
          data: recentRecommendations,
          cached: true
        });
      }
    }

    // Generate new recommendations
    const recommendations = await generateRecommendations(req.user.id);

    // Save recommendations to database
    const savedRecommendations = await Promise.all(
      recommendations.slice(0, parseInt(limit)).map(async rec => {
        const [recommendation] = await AIRecommendation.findOrCreate({
          where: {
            user_id: req.user.id,
            property_id: rec.property_id,
            created_at: {
              [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Same day
            }
          },
          defaults: {
            user_id: req.user.id,
            property_id: rec.property_id,
            score: rec.score,
            factors: rec.factors,
            reason: rec.reason,
            model_version: 'v1.0',
            context: {
              generated_at: new Date(),
              user_activity_count: recommendations.length
            }
          }
        });

        return {
          ...recommendation.toJSON(),
          property: rec.property
        };
      })
    );

    res.json({
      success: true,
      data: savedRecommendations,
      cached: false
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/ai-recommendations/:id/track-shown
// @desc    Track when recommendation was shown to user
// @access  Private
router.post('/:id/track-shown', protect, async (req, res) => {
  try {
    const recommendation = await AIRecommendation.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    await recommendation.update({ shown_at: new Date() });

    res.json({
      success: true,
      message: 'Tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking shown:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/ai-recommendations/:id/track-click
// @desc    Track when user clicked on recommendation
// @access  Private
router.post('/:id/track-click', protect, async (req, res) => {
  try {
    const recommendation = await AIRecommendation.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    await recommendation.update({
      clicked: true,
      clicked_at: new Date()
    });

    res.json({
      success: true,
      message: 'Tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/ai-recommendations/:id/feedback
// @desc    Submit feedback on recommendation quality
// @access  Private
router.post('/:id/feedback', protect, async (req, res) => {
  try {
    const { feedback_score, is_relevant } = req.body;

    const recommendation = await AIRecommendation.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    await recommendation.update({
      feedback_score,
      is_relevant
    });

    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
