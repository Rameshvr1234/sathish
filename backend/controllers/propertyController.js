const { Property, PropertyImage, User, Branch, Lead } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all properties with filters
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const {
      region,
      location,
      property_type,
      budgetMin,
      budgetMax,
      sv_verified,
      owner_only,
      page = 1,
      limit = 12,
      sort = '-created_at'
    } = req.query;

    const where = { status: 'approved', is_active: true };

    // Apply filters
    if (region) where.region = region;
    if (location) where.location = location;
    if (property_type) where.property_type = property_type;
    if (sv_verified === 'true') where.sv_verified = true;
    if (owner_only === 'true') where.is_owner = true;

    // Budget range filter
    if (budgetMin || budgetMax) {
      where.price = {};
      if (budgetMin) where.price[Op.gte] = parseFloat(budgetMin);
      if (budgetMax) where.price[Op.lte] = parseFloat(budgetMax);
    }

    // Sorting
    let order = [];
    if (sort.startsWith('-')) {
      order.push([sort.substring(1), 'DESC']);
    } else {
      order.push([sort, 'ASC']);
    }

    // Pagination
    const offset = (page - 1) * limit;

    const { count, rows: properties } = await Property.findAndCountAll({
      where,
      include: [
        {
          model: PropertyImage,
          as: 'images',
          attributes: ['id', 'image_url', 'is_primary', 'order']
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'phone', 'email']
        },
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'name', 'region']
        }
      ],
      order,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      count,
      total_pages: Math.ceil(count / limit),
      current_page: parseInt(page),
      properties
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties'
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [
        {
          model: PropertyImage,
          as: 'images',
          attributes: ['id', 'image_url', 'is_primary', 'order']
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'phone', 'email', 'profile_image']
        },
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'name', 'region', 'phone', 'email']
        }
      ]
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching property'
    });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private
exports.createProperty = async (req, res) => {
  try {
    const userId = req.user.id;

    // Create property
    const property = await Property.create({
      ...req.body,
      user_id: userId,
      branch_id: req.user.branch_id || null,
      status: 'pending' // Goes to branch admin first
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully. It will be reviewed by admin.',
      property
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating property'
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.user_id !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    await property.update(req.body);

    res.json({
      success: true,
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating property'
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.user_id !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    await property.destroy();

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting property'
    });
  }
};

// @desc    Get locations by region (cascading filter)
// @route   GET /api/properties/search/locations/:region
// @access  Public
exports.getLocationsByRegion = async (req, res) => {
  try {
    const { region } = req.params;

    const locations = await Property.findAll({
      where: {
        region,
        status: 'approved',
        is_active: true
      },
      attributes: [
        'location',
        [require('sequelize').fn('COUNT', 'id'), 'property_count']
      ],
      group: ['location'],
      order: [[require('sequelize').literal('property_count'), 'DESC']]
    });

    res.json({
      success: true,
      region,
      locations: locations.map(loc => ({
        name: loc.location,
        property_count: loc.dataValues.property_count
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching locations'
    });
  }
};

// @desc    Increment property views
// @route   POST /api/properties/:id/increment-view
// @access  Public
exports.incrementView = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    await property.increment('views_count');

    res.json({
      success: true,
      message: 'View count updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating view count'
    });
  }
};

// @desc    Get user's properties
// @route   GET /api/properties/my-properties
// @access  Private
exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: PropertyImage,
          as: 'images',
          attributes: ['id', 'image_url', 'is_primary']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your properties'
    });
  }
};
