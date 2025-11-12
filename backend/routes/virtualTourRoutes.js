const express = require('express');
const router = express.Router();
const { VirtualTour, Property } = require('../models');
const { protect } = require('../middleware/auth');

// @route   GET /api/virtual-tours/property/:propertyId
// @desc    Get virtual tours for a property
// @access  Public
router.get('/property/:propertyId', async (req, res) => {
  try {
    const tours = await VirtualTour.findAll({
      where: {
        property_id: req.params.propertyId,
        is_active: true
      },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: tours
    });
  } catch (error) {
    console.error('Error fetching virtual tours:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/virtual-tours
// @desc    Create virtual tour
// @access  Private (Property owner or admin)
router.post('/', protect, async (req, res) => {
  try {
    const {
      property_id,
      title,
      description,
      tour_type,
      panorama_images,
      tour_url,
      default_scene,
      auto_rotate,
      show_controls,
      allow_fullscreen
    } = req.body;

    // Verify property ownership
    const property = await Property.findByPk(property_id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.user_id !== req.user.id && req.user.role !== 'super_admin' && req.user.role !== 'branch_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create virtual tour for this property'
      });
    }

    const virtualTour = await VirtualTour.create({
      property_id,
      title,
      description,
      tour_type,
      panorama_images: panorama_images || [],
      tour_url,
      default_scene: default_scene || 0,
      auto_rotate: auto_rotate !== undefined ? auto_rotate : true,
      show_controls: show_controls !== undefined ? show_controls : true,
      allow_fullscreen: allow_fullscreen !== undefined ? allow_fullscreen : true,
      published_at: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Virtual tour created successfully',
      data: virtualTour
    });
  } catch (error) {
    console.error('Error creating virtual tour:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/virtual-tours/:id
// @desc    Update virtual tour
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const tour = await VirtualTour.findByPk(req.params.id, {
      include: [{ model: Property, as: 'property' }]
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Virtual tour not found'
      });
    }

    // Check authorization
    if (tour.property.user_id !== req.user.id && req.user.role !== 'super_admin' && req.user.role !== 'branch_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const {
      title,
      description,
      tour_type,
      panorama_images,
      tour_url,
      default_scene,
      auto_rotate,
      show_controls,
      allow_fullscreen,
      is_active
    } = req.body;

    await tour.update({
      title: title || tour.title,
      description: description !== undefined ? description : tour.description,
      tour_type: tour_type || tour.tour_type,
      panorama_images: panorama_images !== undefined ? panorama_images : tour.panorama_images,
      tour_url: tour_url !== undefined ? tour_url : tour.tour_url,
      default_scene: default_scene !== undefined ? default_scene : tour.default_scene,
      auto_rotate: auto_rotate !== undefined ? auto_rotate : tour.auto_rotate,
      show_controls: show_controls !== undefined ? show_controls : tour.show_controls,
      allow_fullscreen: allow_fullscreen !== undefined ? allow_fullscreen : tour.allow_fullscreen,
      is_active: is_active !== undefined ? is_active : tour.is_active
    });

    res.json({
      success: true,
      message: 'Virtual tour updated successfully',
      data: tour
    });
  } catch (error) {
    console.error('Error updating virtual tour:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/virtual-tours/:id/view
// @desc    Track virtual tour view
// @access  Public
router.post('/:id/view', async (req, res) => {
  try {
    const { duration } = req.body; // Duration in seconds

    const tour = await VirtualTour.findByPk(req.params.id);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Virtual tour not found'
      });
    }

    // Update view count
    const newViewCount = tour.views_count + 1;

    // Calculate new average duration
    let newAvgDuration = tour.avg_view_duration;
    if (duration) {
      newAvgDuration = Math.round(
        (tour.avg_view_duration * tour.views_count + duration) / newViewCount
      );
    }

    await tour.update({
      views_count: newViewCount,
      avg_view_duration: newAvgDuration
    });

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

// @route   DELETE /api/virtual-tours/:id
// @desc    Delete virtual tour
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const tour = await VirtualTour.findByPk(req.params.id, {
      include: [{ model: Property, as: 'property' }]
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Virtual tour not found'
      });
    }

    // Check authorization
    if (tour.property.user_id !== req.user.id && req.user.role !== 'super_admin' && req.user.role !== 'branch_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await tour.destroy();

    res.json({
      success: true,
      message: 'Virtual tour deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting virtual tour:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
