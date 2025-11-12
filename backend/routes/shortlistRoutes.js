const express = require('express');
const router = express.Router();
const { Shortlist, Property, PropertyImage, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get user's shortlisted properties
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { folder, priority, tag } = req.query;

    const where = { user_id: req.user.id };
    if (folder) where.folder = folder;
    if (priority) where.priority = priority;

    const shortlist = await Shortlist.findAll({
      where,
      include: [
        {
          model: Property,
          as: 'property',
          include: [
            {
              model: PropertyImage,
              as: 'images',
              limit: 3
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Filter by tag if specified
    let filteredList = shortlist;
    if (tag) {
      filteredList = shortlist.filter(item =>
        item.tags && item.tags.includes(tag)
      );
    }

    res.status(200).json({
      success: true,
      data: filteredList,
      count: filteredList.length
    });
  } catch (error) {
    console.error('Error fetching shortlist:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's folders
router.get('/folders', authenticateToken, async (req, res) => {
  try {
    const folders = await Shortlist.findAll({
      where: { user_id: req.user.id },
      attributes: ['folder'],
      group: ['folder'],
      raw: true
    });

    const folderCounts = await Promise.all(
      folders.map(async (f) => {
        const count = await Shortlist.count({
          where: { user_id: req.user.id, folder: f.folder }
        });
        return {
          folder: f.folder,
          count
        };
      })
    );

    res.status(200).json({
      success: true,
      data: folderCounts
    });
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add property to shortlist
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { property_id, tags = [], notes, folder = 'default', priority = 'medium' } = req.body;

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

    // Check if already shortlisted
    const existing = await Shortlist.findOne({
      where: { user_id: req.user.id, property_id }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Property already in shortlist'
      });
    }

    // Add to shortlist
    const shortlistItem = await Shortlist.create({
      user_id: req.user.id,
      property_id,
      tags,
      notes,
      folder,
      priority
    });

    res.status(201).json({
      success: true,
      message: 'Property added to shortlist',
      data: shortlistItem
    });
  } catch (error) {
    console.error('Error adding to shortlist:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update shortlist item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { tags, notes, folder, priority } = req.body;

    const shortlistItem = await Shortlist.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!shortlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Shortlist item not found'
      });
    }

    if (tags !== undefined) shortlistItem.tags = tags;
    if (notes !== undefined) shortlistItem.notes = notes;
    if (folder !== undefined) shortlistItem.folder = folder;
    if (priority !== undefined) shortlistItem.priority = priority;

    await shortlistItem.save();

    res.status(200).json({
      success: true,
      message: 'Shortlist item updated',
      data: shortlistItem
    });
  } catch (error) {
    console.error('Error updating shortlist item:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Remove property from shortlist
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Shortlist.destroy({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Shortlist item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property removed from shortlist'
    });
  } catch (error) {
    console.error('Error removing from shortlist:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Check if property is shortlisted
router.get('/check/:property_id', authenticateToken, async (req, res) => {
  try {
    const shortlisted = await Shortlist.findOne({
      where: {
        user_id: req.user.id,
        property_id: req.params.property_id
      }
    });

    res.status(200).json({
      success: true,
      isShortlisted: !!shortlisted,
      data: shortlisted
    });
  } catch (error) {
    console.error('Error checking shortlist status:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Generate shareable link for shortlist
router.post('/share', authenticateToken, async (req, res) => {
  try {
    const { folder = 'default' } = req.body;

    const shortlist = await Shortlist.findAll({
      where: { user_id: req.user.id, folder },
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'price', 'property_type']
        }
      ]
    });

    if (shortlist.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No properties in this folder'
      });
    }

    const propertyIds = shortlist.map(item => item.property_id).join(',');
    const shareLink = `${process.env.FRONTEND_URL}/properties/compare?ids=${propertyIds}`;

    res.status(200).json({
      success: true,
      shareLink,
      count: shortlist.length
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
