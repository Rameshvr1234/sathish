const express = require('express');
const router = express.Router();
const { Property, LocalityInsights } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Get price trends for a specific locality
router.get('/locality/:localityName', async (req, res) => {
  try {
    const localityName = decodeURIComponent(req.params.localityName);
    const { propertyType, timeRange = '12' } = req.query;

    // Get locality insights for baseline data
    const locality = await LocalityInsights.findOne({
      where: { locality_name: localityName }
    });

    // Get current properties in the locality
    const where = { locality: localityName, status: 'active' };
    if (propertyType) where.property_type = propertyType;

    const properties = await Property.findAll({
      where,
      attributes: ['price', 'property_type', 'built_up_area', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    if (properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No properties found in this locality'
      });
    }

    // Calculate current average price per sqft
    const avgPrice = properties.reduce((sum, p) => {
      const pricePerSqft = p.built_up_area > 0 ? p.price / p.built_up_area : 0;
      return sum + pricePerSqft;
    }, 0) / properties.length;

    // Generate trend data (simulated for demo - in production, use historical data)
    const months = parseInt(timeRange);
    const trendData = [];
    const currentDate = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);

      // Simulate historical prices based on locality trends
      const yearTrend = locality ? parseFloat(locality.price_trend_1yr) || 0 : 0;
      const monthlyChange = yearTrend / 12;
      const historicalPrice = avgPrice / Math.pow(1 + (monthlyChange / 100), i);

      trendData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        avgPricePerSqft: Math.round(historicalPrice),
        totalListings: Math.max(1, properties.length - Math.floor(Math.random() * 5))
      });
    }

    // Calculate statistics
    const prices = properties.map(p => p.price);
    const stats = {
      currentAvgPricePerSqft: Math.round(avgPrice),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      totalProperties: properties.length,
      priceChange1yr: locality ? locality.price_trend_1yr : null,
      priceChange3yr: locality ? locality.price_trend_3yr : null
    };

    // Group by property type
    const typeDistribution = properties.reduce((acc, p) => {
      acc[p.property_type] = (acc[p.property_type] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        locality: localityName,
        trendData,
        statistics: stats,
        propertyTypeDistribution: typeDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching locality price trends:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get price trends for a specific property's area
router.get('/property/:propertyId', async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Get similar properties in the same locality
    const similarProperties = await Property.findAll({
      where: {
        locality: property.locality,
        property_type: property.property_type,
        status: 'active',
        id: { [Op.ne]: property.id }
      },
      attributes: ['price', 'built_up_area', 'created_at'],
      limit: 50
    });

    if (similarProperties.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Not enough data for trend analysis',
        data: {
          property: {
            id: property.id,
            title: property.title,
            locality: property.locality,
            price: property.price
          },
          trendData: []
        }
      });
    }

    // Calculate average prices
    const avgPricePerSqft = similarProperties.reduce((sum, p) => {
      return sum + (p.built_up_area > 0 ? p.price / p.built_up_area : 0);
    }, 0) / similarProperties.length;

    const propertyPricePerSqft = property.built_up_area > 0
      ? property.price / property.built_up_area
      : 0;

    const priceComparison = propertyPricePerSqft > 0
      ? ((propertyPricePerSqft - avgPricePerSqft) / avgPricePerSqft * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        property: {
          id: property.id,
          title: property.title,
          locality: property.locality,
          price: property.price,
          pricePerSqft: Math.round(propertyPricePerSqft)
        },
        areaAverage: {
          avgPricePerSqft: Math.round(avgPricePerSqft),
          sampleSize: similarProperties.length,
          priceComparison: `${priceComparison}%`,
          status: priceComparison > 0 ? 'above average' : priceComparison < 0 ? 'below average' : 'at average'
        }
      }
    });
  } catch (error) {
    console.error('Error fetching property area trends:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get price heatmap data for map visualization
router.get('/heatmap', async (req, res) => {
  try {
    const { city, propertyType, minPrice, maxPrice } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required'
      });
    }

    // Get all localities in the city with coordinates
    const where = { city };
    const localities = await LocalityInsights.findAll({
      where,
      attributes: [
        'id',
        'locality_name',
        'city',
        'latitude',
        'longitude',
        'avg_price_per_sqft',
        'overall_rating'
      ]
    });

    if (localities.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No locality data found for this city'
      });
    }

    // Build price filter
    const priceWhere = { city, status: 'active' };
    if (propertyType) priceWhere.property_type = propertyType;
    if (minPrice) priceWhere.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) {
      priceWhere.price = priceWhere.price || {};
      priceWhere.price[Op.lte] = parseFloat(maxPrice);
    }

    // Get property counts per locality
    const propertyCounts = await Property.findAll({
      where: priceWhere,
      attributes: [
        'locality',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('price')), 'avgPrice']
      ],
      group: ['locality'],
      raw: true
    });

    // Create lookup map
    const countMap = {};
    propertyCounts.forEach(pc => {
      countMap[pc.locality] = {
        count: parseInt(pc.count),
        avgPrice: parseFloat(pc.avgPrice)
      };
    });

    // Build heatmap data
    const heatmapData = localities
      .filter(loc => loc.latitude && loc.longitude)
      .map(loc => {
        const propData = countMap[loc.locality_name] || { count: 0, avgPrice: 0 };
        return {
          locality: loc.locality_name,
          latitude: parseFloat(loc.latitude),
          longitude: parseFloat(loc.longitude),
          avgPricePerSqft: parseFloat(loc.avg_price_per_sqft) || 0,
          propertyCount: propData.count,
          avgPropertyPrice: Math.round(propData.avgPrice),
          rating: parseFloat(loc.overall_rating) || 0
        };
      })
      .filter(loc => loc.propertyCount > 0 || loc.avgPricePerSqft > 0);

    res.status(200).json({
      success: true,
      city,
      data: heatmapData,
      count: heatmapData.length
    });
  } catch (error) {
    console.error('Error generating price heatmap:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get city-wide price statistics
router.get('/city/:city', async (req, res) => {
  try {
    const city = decodeURIComponent(req.params.city);
    const { propertyType } = req.query;

    // Get all localities in city
    const localities = await LocalityInsights.findAll({
      where: { city },
      attributes: ['locality_name', 'avg_price_per_sqft', 'price_trend_1yr']
    });

    if (localities.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No data found for this city'
      });
    }

    // Get active properties in city
    const where = { city, status: 'active' };
    if (propertyType) where.property_type = propertyType;

    const properties = await Property.findAll({
      where,
      attributes: ['price', 'property_type', 'built_up_area']
    });

    // Calculate city-wide statistics
    const prices = properties.map(p => p.price);
    const pricesPerSqft = properties
      .filter(p => p.built_up_area > 0)
      .map(p => p.price / p.built_up_area);

    const stats = {
      city,
      totalProperties: properties.length,
      totalLocalities: localities.length,
      avgPrice: prices.length > 0
        ? Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length)
        : 0,
      minPrice: prices.length > 0 ? Math.min(...prices) : 0,
      maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
      avgPricePerSqft: pricesPerSqft.length > 0
        ? Math.round(pricesPerSqft.reduce((sum, p) => sum + p, 0) / pricesPerSqft.length)
        : 0
    };

    // Top and bottom localities by price
    const sortedLocalities = localities
      .filter(l => l.avg_price_per_sqft > 0)
      .sort((a, b) => b.avg_price_per_sqft - a.avg_price_per_sqft);

    const topLocalities = sortedLocalities.slice(0, 5);
    const bottomLocalities = sortedLocalities.slice(-5).reverse();

    // Fastest growing localities
    const growingLocalities = localities
      .filter(l => l.price_trend_1yr)
      .sort((a, b) => parseFloat(b.price_trend_1yr) - parseFloat(a.price_trend_1yr))
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        statistics: stats,
        topExpensiveLocalities: topLocalities,
        mostAffordableLocalities: bottomLocalities,
        fastestGrowingLocalities: growingLocalities
      }
    });
  } catch (error) {
    console.error('Error fetching city price trends:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Compare price trends across multiple localities
router.post('/compare', async (req, res) => {
  try {
    const { localities, propertyType, timeRange = '12' } = req.body;

    if (!localities || !Array.isArray(localities) || localities.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Localities array is required'
      });
    }

    if (localities.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Cannot compare more than 5 localities'
      });
    }

    const comparison = await Promise.all(
      localities.map(async (localityName) => {
        // Get locality insights
        const locality = await LocalityInsights.findOne({
          where: { locality_name: localityName }
        });

        // Get active properties
        const where = { locality: localityName, status: 'active' };
        if (propertyType) where.property_type = propertyType;

        const properties = await Property.findAll({
          where,
          attributes: ['price', 'built_up_area']
        });

        const pricesPerSqft = properties
          .filter(p => p.built_up_area > 0)
          .map(p => p.price / p.built_up_area);

        return {
          locality: localityName,
          currentAvgPricePerSqft: pricesPerSqft.length > 0
            ? Math.round(pricesPerSqft.reduce((sum, p) => sum + p, 0) / pricesPerSqft.length)
            : locality ? parseFloat(locality.avg_price_per_sqft) : 0,
          priceChange1yr: locality ? locality.price_trend_1yr : null,
          priceChange3yr: locality ? locality.price_trend_3yr : null,
          totalProperties: properties.length,
          rating: locality ? parseFloat(locality.overall_rating) : 0
        };
      })
    );

    res.status(200).json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Error comparing price trends:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
