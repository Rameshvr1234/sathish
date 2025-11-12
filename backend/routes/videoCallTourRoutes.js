const express = require('express');
const router = express.Router();
const { VideoCallTour, Property, User } = require('../models');
const { protect } = require('../middleware/auth');
const crypto = require('crypto');

// Generate Agora token (mock implementation - replace with actual Agora SDK)
const generateAgoraToken = (channelName, uid) => {
  // In production, use Agora RTC Token Builder
  // This is a mock implementation
  return crypto.randomBytes(32).toString('hex');
};

// @route   GET /api/video-call-tours/my-tours
// @desc    Get user's video call tours
// @access  Private
router.get('/my-tours', protect, async (req, res) => {
  try {
    const { status, type } = req.query;

    const whereClause = {};
    if (status) whereClause.status = status;

    // User can be either requester or agent
    const userField = type === 'agent' ? 'agent_id' : 'user_id';
    whereClause[userField] = req.user.id;

    const tours = await VideoCallTour.findAll({
      where: whereClause,
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'property_type', 'price', 'location', 'city']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'agent',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['scheduled_at', 'DESC']]
    });

    res.json({
      success: true,
      data: tours
    });
  } catch (error) {
    console.error('Error fetching video call tours:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/video-call-tours
// @desc    Schedule a video call tour
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      property_id,
      scheduled_at,
      duration_minutes,
      user_notes
    } = req.body;

    // Validate property exists
    const property = await Property.findByPk(property_id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email', 'phone'] }]
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if scheduled time is in the future
    const scheduledDate = new Date(scheduled_at);
    if (scheduledDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time must be in the future'
      });
    }

    // Generate channel name and token
    const channelName = `tour_${property_id}_${Date.now()}`;
    const agoraToken = generateAgoraToken(channelName, req.user.id);

    const videoCallTour = await VideoCallTour.create({
      property_id,
      user_id: req.user.id,
      agent_id: property.user_id,
      scheduled_at: scheduledDate,
      duration_minutes: duration_minutes || 30,
      user_notes,
      channel_name: channelName,
      agora_token: agoraToken,
      status: 'scheduled'
    });

    // Load the created tour with associations
    const tourWithDetails = await VideoCallTour.findByPk(videoCallTour.id, {
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'property_type', 'price', 'location']
        },
        {
          model: User,
          as: 'agent',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    // TODO: Send notifications to both user and agent

    res.status(201).json({
      success: true,
      message: 'Video call tour scheduled successfully',
      data: tourWithDetails
    });
  } catch (error) {
    console.error('Error scheduling video call tour:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/video-call-tours/:id/confirm
// @desc    Confirm video call tour (by agent)
// @access  Private
router.put('/:id/confirm', protect, async (req, res) => {
  try {
    const tour = await VideoCallTour.findByPk(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Video call tour not found'
      });
    }

    // Only agent can confirm
    if (tour.agent_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the assigned agent can confirm this tour'
      });
    }

    if (tour.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Tour cannot be confirmed in current status'
      });
    }

    await tour.update({ status: 'confirmed' });

    res.json({
      success: true,
      message: 'Video call tour confirmed successfully',
      data: tour
    });
  } catch (error) {
    console.error('Error confirming video call tour:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/video-call-tours/:id/start
// @desc    Start video call tour
// @access  Private
router.put('/:id/start', protect, async (req, res) => {
  try {
    const tour = await VideoCallTour.findByPk(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Video call tour not found'
      });
    }

    // Only user or agent can start
    if (tour.user_id !== req.user.id && tour.agent_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (tour.status !== 'scheduled' && tour.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Tour cannot be started in current status'
      });
    }

    // Regenerate token for security
    const newToken = generateAgoraToken(tour.channel_name, req.user.id);

    await tour.update({
      status: 'in_progress',
      started_at: new Date(),
      agora_token: newToken
    });

    res.json({
      success: true,
      message: 'Video call tour started successfully',
      data: {
        id: tour.id,
        channel_name: tour.channel_name,
        agora_token: newToken,
        property_id: tour.property_id
      }
    });
  } catch (error) {
    console.error('Error starting video call tour:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/video-call-tours/:id/end
// @desc    End video call tour
// @access  Private
router.put('/:id/end', protect, async (req, res) => {
  try {
    const { agent_notes, recording_url } = req.body;

    const tour = await VideoCallTour.findByPk(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Video call tour not found'
      });
    }

    // Only user or agent can end
    if (tour.user_id !== req.user.id && tour.agent_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (tour.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Tour is not in progress'
      });
    }

    const endTime = new Date();
    const actualDuration = tour.started_at
      ? Math.round((endTime - tour.started_at) / 1000)
      : 0;

    await tour.update({
      status: 'completed',
      ended_at: endTime,
      actual_duration: actualDuration,
      agent_notes: agent_notes || tour.agent_notes,
      recording_url: recording_url || tour.recording_url
    });

    res.json({
      success: true,
      message: 'Video call tour completed successfully',
      data: tour
    });
  } catch (error) {
    console.error('Error ending video call tour:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/video-call-tours/:id/cancel
// @desc    Cancel video call tour
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const { cancellation_reason } = req.body;

    const tour = await VideoCallTour.findByPk(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Video call tour not found'
      });
    }

    // Only user or agent can cancel
    if (tour.user_id !== req.user.id && tour.agent_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (tour.status === 'completed' || tour.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Tour cannot be cancelled in current status'
      });
    }

    await tour.update({
      status: 'cancelled',
      cancellation_reason,
      cancelled_by: req.user.id,
      cancelled_at: new Date()
    });

    res.json({
      success: true,
      message: 'Video call tour cancelled successfully',
      data: tour
    });
  } catch (error) {
    console.error('Error cancelling video call tour:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/video-call-tours/:id/feedback
// @desc    Submit feedback for video call tour
// @access  Private
router.put('/:id/feedback', protect, async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    const tour = await VideoCallTour.findByPk(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Video call tour not found'
      });
    }

    // Only user can give feedback
    if (tour.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the tour requester can provide feedback'
      });
    }

    if (tour.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only provide feedback for completed tours'
      });
    }

    await tour.update({
      rating,
      feedback
    });

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: tour
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
