const { OfferNews, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all offers and news
// @route   GET /api/offers-news
// @access  Public
exports.getOffersNews = async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = { is_active: true };

    if (type) {
      where.type = type;
    }

    // Filter active offers (within valid date range)
    if (type === 'offer') {
      where.valid_until = {
        [Op.or]: [
          { [Op.gte]: new Date() },
          { [Op.is]: null }
        ]
      };
    }

    const { count, rows: items } = await OfferNews.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      count,
      total_pages: Math.ceil(count / limit),
      current_page: parseInt(page),
      items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching offers and news'
    });
  }
};

// @desc    Get single offer/news
// @route   GET /api/offers-news/:id
// @access  Public
exports.getSingleOfferNews = async (req, res) => {
  try {
    const item = await OfferNews.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching item'
    });
  }
};

// @desc    Create offer/news
// @route   POST /api/offers-news
// @access  Private (Admin)
exports.createOfferNews = async (req, res) => {
  try {
    const item = await OfferNews.create({
      ...req.body,
      created_by: req.user.id
    });

    res.status(201).json({
      success: true,
      message: `${item.type === 'offer' ? 'Offer' : 'News'} created successfully`,
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating item'
    });
  }
};

// @desc    Update offer/news
// @route   PUT /api/offers-news/:id
// @access  Private (Admin)
exports.updateOfferNews = async (req, res) => {
  try {
    const item = await OfferNews.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    await item.update(req.body);

    res.json({
      success: true,
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating item'
    });
  }
};

// @desc    Delete offer/news
// @route   DELETE /api/offers-news/:id
// @access  Private (Admin)
exports.deleteOfferNews = async (req, res) => {
  try {
    const item = await OfferNews.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    await item.destroy();

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting item'
    });
  }
};

// @desc    Get active offers
// @route   GET /api/offers-news/active-offers
// @access  Public
exports.getActiveOffers = async (req, res) => {
  try {
    const offers = await OfferNews.findAll({
      where: {
        type: 'offer',
        is_active: true,
        [Op.or]: [
          {
            [Op.and]: [
              { valid_from: { [Op.lte]: new Date() } },
              { valid_until: { [Op.gte]: new Date() } }
            ]
          },
          {
            valid_from: { [Op.is]: null },
            valid_until: { [Op.is]: null }
          }
        ]
      },
      order: [['created_at', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      offers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active offers'
    });
  }
};
