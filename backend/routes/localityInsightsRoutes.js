const express = require('express');
const router = express.Router();
const { LocalityInsights, Property } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all localities with filters
router.get('/', async (req, res) => {
  try {
    const {
      city,
      minRating,
      maxPrice,
      sortBy = 'overall_rating',
      order = 'DESC',
      limit = 50,
      offset = 0
    } = req.query;

    const where = {};
    if (city) where.city = city;
    if (minRating) where.overall_rating = { [Op.gte]: parseFloat(minRating) };
    if (maxPrice) where.avg_price_per_sqft = { [Op.lte]: parseFloat(maxPrice) };

    const validSortFields = [
      'overall_rating',
      'safety_score',
      'connectivity_score',
      'lifestyle_score',
      'avg_price_per_sqft',
      'growth_potential_score'
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'overall_rating';

    const localities = await LocalityInsights.findAndCountAll({
      where,
      order: [[sortField, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: localities.rows,
      total: localities.count,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(localities.count / limit)
    });
  } catch (error) {
    console.error('Error fetching localities:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get unique cities
router.get('/cities', async (req, res) => {
  try {
    const cities = await LocalityInsights.findAll({
      attributes: ['city'],
      group: ['city'],
      raw: true
    });

    res.status(200).json({
      success: true,
      data: cities.map(c => c.city)
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get detailed locality insights by ID
router.get('/:id', async (req, res) => {
  try {
    const locality = await LocalityInsights.findByPk(req.params.id);

    if (!locality) {
      return res.status(404).json({
        success: false,
        message: 'Locality not found'
      });
    }

    // Get property count and price range in this locality
    const properties = await Property.findAll({
      where: { locality: locality.locality_name },
      attributes: ['price'],
      raw: true
    });

    const stats = {
      propertyCount: properties.length,
      minPrice: properties.length > 0 ? Math.min(...properties.map(p => p.price)) : 0,
      maxPrice: properties.length > 0 ? Math.max(...properties.map(p => p.price)) : 0,
      avgPrice: properties.length > 0
        ? properties.reduce((sum, p) => sum + p.price, 0) / properties.length
        : 0
    };

    res.status(200).json({
      success: true,
      data: {
        ...locality.toJSON(),
        propertyStats: stats
      }
    });
  } catch (error) {
    console.error('Error fetching locality details:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get locality by name
router.get('/by-name/:localityName', async (req, res) => {
  try {
    const localityName = decodeURIComponent(req.params.localityName);

    const locality = await LocalityInsights.findOne({
      where: { locality_name: localityName }
    });

    if (!locality) {
      return res.status(404).json({
        success: false,
        message: 'Locality not found'
      });
    }

    // Get property stats
    const properties = await Property.findAll({
      where: { locality: locality.locality_name },
      attributes: ['price', 'property_type'],
      raw: true
    });

    const stats = {
      propertyCount: properties.length,
      minPrice: properties.length > 0 ? Math.min(...properties.map(p => p.price)) : 0,
      maxPrice: properties.length > 0 ? Math.max(...properties.map(p => p.price)) : 0
    };

    res.status(200).json({
      success: true,
      data: {
        ...locality.toJSON(),
        propertyStats: stats
      }
    });
  } catch (error) {
    console.error('Error fetching locality by name:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Compare multiple localities
router.post('/compare', async (req, res) => {
  try {
    const { localityIds } = req.body;

    if (!localityIds || !Array.isArray(localityIds) || localityIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Locality IDs array is required'
      });
    }

    if (localityIds.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Cannot compare more than 5 localities at once'
      });
    }

    const localities = await LocalityInsights.findAll({
      where: {
        id: { [Op.in]: localityIds }
      }
    });

    if (localities.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No localities found'
      });
    }

    // Create comparison data
    const comparison = {
      localities: localities.map(loc => ({
        id: loc.id,
        name: loc.locality_name,
        city: loc.city,
        overall_rating: loc.overall_rating,
        safety_score: loc.safety_score,
        connectivity_score: loc.connectivity_score,
        lifestyle_score: loc.lifestyle_score,
        environment_score: loc.environment_score,
        growth_potential_score: loc.growth_potential_score,
        avg_price_per_sqft: loc.avg_price_per_sqft,
        price_trend_1yr: loc.price_trend_1yr,
        nearest_metro: loc.nearest_metro,
        metro_distance_km: loc.metro_distance_km,
        schools_count: loc.schools_count,
        hospitals_count: loc.hospitals_count,
        parks_count: loc.parks_count,
        pros: loc.pros,
        cons: loc.cons
      }))
    };

    res.status(200).json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Error comparing localities:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get top localities by criteria
router.get('/top/:criteria', async (req, res) => {
  try {
    const { criteria } = req.params;
    const { city, limit = 10 } = req.query;

    const validCriteria = {
      'safety': 'safety_score',
      'connectivity': 'connectivity_score',
      'lifestyle': 'lifestyle_score',
      'environment': 'environment_score',
      'growth': 'growth_potential_score',
      'overall': 'overall_rating'
    };

    const sortField = validCriteria[criteria] || 'overall_rating';
    const where = city ? { city } : {};

    const localities = await LocalityInsights.findAll({
      where,
      order: [[sortField, 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      criteria,
      data: localities
    });
  } catch (error) {
    console.error('Error fetching top localities:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Search localities
router.get('/search/:query', async (req, res) => {
  try {
    const query = decodeURIComponent(req.params.query);
    const { city, limit = 20 } = req.query;

    const where = {
      locality_name: { [Op.iLike]: `%${query}%` }
    };
    if (city) where.city = city;

    const localities = await LocalityInsights.findAll({
      where,
      order: [['overall_rating', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: localities,
      count: localities.length
    });
  } catch (error) {
    console.error('Error searching localities:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get nearby localities by coordinates
router.post('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Haversine formula to find localities within radius (in km)
    const localities = await LocalityInsights.findAll({
      where: {
        latitude: { [Op.ne]: null },
        longitude: { [Op.ne]: null }
      }
    });

    // Calculate distances
    const nearbyLocalities = localities
      .map(loc => {
        const lat1 = parseFloat(latitude);
        const lon1 = parseFloat(longitude);
        const lat2 = parseFloat(loc.latitude);
        const lon2 = parseFloat(loc.longitude);

        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return {
          ...loc.toJSON(),
          distance: parseFloat(distance.toFixed(2))
        };
      })
      .filter(loc => loc.distance <= parseFloat(radius))
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      data: nearbyLocalities,
      count: nearbyLocalities.length
    });
  } catch (error) {
    console.error('Error finding nearby localities:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
