const express = require('express');
const router = express.Router();
const { Review, Property, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Create a review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      property_id,
      builder_id,
      agent_id,
      review_type,
      rating,
      title,
      comment,
      pros,
      cons,
      images
    } = req.body;

    // Validate required fields
    if (!review_type || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide review_type, rating, title, and comment'
      });
    }

    // Check if user has already reviewed
    const existingReview = await Review.findOne({
      where: {
        user_id: req.user.id,
        [Op.or]: [
          { property_id },
          { builder_id },
          { agent_id }
        ]
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this ' + review_type
      });
    }

    const review = await Review.create({
      user_id: req.user.id,
      property_id,
      builder_id,
      agent_id,
      review_type,
      rating,
      title,
      comment,
      pros: pros || [],
      cons: cons || [],
      images: images || [],
      status: 'pending'
    });

    // Update property/builder rating
    if (property_id) {
      await updatePropertyRating(property_id);
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get reviews for a property/builder/agent
router.get('/', async (req, res) => {
  try {
    const { property_id, builder_id, agent_id, review_type, status = 'approved', page = 1, limit = 10 } = req.query;

    const where = { status };

    if (property_id) where.property_id = property_id;
    if (builder_id) where.builder_id = builder_id;
    if (agent_id) where.agent_id = agent_id;
    if (review_type) where.review_type = review_type;

    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'full_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: reviews,
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

// Get single review
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'full_name', 'email']
        },
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'location', 'region']
        }
      ]
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update review (own review only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }

    const { rating, title, comment, pros, cons, images } = req.body;

    await review.update({
      rating: rating || review.rating,
      title: title || review.title,
      comment: comment || review.comment,
      pros: pros || review.pros,
      cons: cons || review.cons,
      images: images || review.images,
      status: 'pending' // Reset to pending after edit
    });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete review (own review only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user_id !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    await review.destroy();

    // Update ratings
    if (review.property_id) {
      await updatePropertyRating(review.property_id);
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Mark review as helpful
router.post('/:id/helpful', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.helpful_count += 1;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Marked as helpful',
      data: { helpful_count: review.helpful_count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get review statistics for property/builder
router.get('/stats/:entityId', async (req, res) => {
  try {
    const { entityId } = req.params;
    const { type = 'property' } = req.query;

    const where = {};
    if (type === 'property') where.property_id = entityId;
    if (type === 'builder') where.builder_id = entityId;
    if (type === 'agent') where.agent_id = entityId;

    where.status = 'approved';

    const reviews = await Review.findAll({ where });

    if (reviews.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      });
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / totalReviews;

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rating = Math.floor(parseFloat(r.rating));
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        averageRating: averageRating.toFixed(1),
        ratingDistribution
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Admin: Approve/Reject review
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin' && req.user.role !== 'branch_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can approve/reject reviews'
      });
    }

    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either approved or rejected'
      });
    }

    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = status;
    await review.save();

    // Update ratings if approved
    if (status === 'approved' && review.property_id) {
      await updatePropertyRating(review.property_id);
    }

    res.status(200).json({
      success: true,
      message: `Review ${status} successfully`,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Helper function to update property rating
async function updatePropertyRating(propertyId) {
  const reviews = await Review.findAll({
    where: {
      property_id: propertyId,
      status: 'approved'
    }
  });

  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / reviews.length;

    await Property.update(
      {
        // Assuming we add a rating field to Property model
        // rating: avgRating.toFixed(1),
        // review_count: reviews.length
      },
      { where: { id: propertyId } }
    );
  }
}

module.exports = router;
