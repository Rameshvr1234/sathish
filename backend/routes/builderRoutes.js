const express = require('express');
const router = express.Router();
const { Builder, Project, Review } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all builders
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, status = 'approved', search, featured } = req.query;
    const offset = (page - 1) * limit;

    const where = { status };

    if (featured === 'true') {
      where.is_featured = true;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { company_name: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: builders } = await Builder.findAndCountAll({
      where,
      include: [
        {
          model: Project,
          as: 'projects',
          attributes: ['id', 'name', 'construction_status', 'launch_date']
        }
      ],
      order: [['rating', 'DESC'], ['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: builders,
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

// Get single builder
router.get('/:id', async (req, res) => {
  try {
    const builder = await Builder.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          as: 'projects',
          where: { status: 'approved' },
          required: false
        },
        {
          model: Review,
          as: 'reviews',
          where: { status: 'approved' },
          required: false,
          limit: 5,
          order: [['created_at', 'DESC']]
        }
      ]
    });

    if (!builder) {
      return res.status(404).json({
        success: false,
        message: 'Builder not found'
      });
    }

    res.status(200).json({
      success: true,
      data: builder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create builder (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can create builders'
      });
    }

    const builder = await Builder.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Builder created successfully',
      data: builder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update builder
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can update builders'
      });
    }

    const builder = await Builder.findByPk(req.params.id);

    if (!builder) {
      return res.status(404).json({
        success: false,
        message: 'Builder not found'
      });
    }

    await builder.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Builder updated successfully',
      data: builder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete builder
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can delete builders'
      });
    }

    const builder = await Builder.findByPk(req.params.id);

    if (!builder) {
      return res.status(404).json({
        success: false,
        message: 'Builder not found'
      });
    }

    await builder.destroy();

    res.status(200).json({
      success: true,
      message: 'Builder deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Verify builder RERA
router.patch('/:id/verify-rera', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can verify RERA'
      });
    }

    const builder = await Builder.findByPk(req.params.id);

    if (!builder) {
      return res.status(404).json({
        success: false,
        message: 'Builder not found'
      });
    }

    builder.rera_verified = true;
    builder.is_verified = true;
    await builder.save();

    res.status(200).json({
      success: true,
      message: 'RERA verified successfully',
      data: builder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Approve/Reject builder
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can change builder status'
      });
    }

    const { status } = req.body;

    if (!['approved', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const builder = await Builder.findByPk(req.params.id);

    if (!builder) {
      return res.status(404).json({
        success: false,
        message: 'Builder not found'
      });
    }

    builder.status = status;
    await builder.save();

    res.status(200).json({
      success: true,
      message: `Builder ${status} successfully`,
      data: builder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get builder statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const builder = await Builder.findByPk(req.params.id);

    if (!builder) {
      return res.status(404).json({
        success: false,
        message: 'Builder not found'
      });
    }

    const projects = await Project.findAll({
      where: { builder_id: req.params.id }
    });

    const stats = {
      totalProjects: projects.length,
      ongoingProjects: projects.filter(p => p.construction_status === 'under_construction').length,
      completedProjects: projects.filter(p => p.construction_status === 'ready_to_move').length,
      newLaunches: projects.filter(p => p.construction_status === 'new_launch').length,
      totalUnits: projects.reduce((sum, p) => sum + p.total_units, 0),
      soldUnits: projects.reduce((sum, p) => sum + p.sold_units, 0),
      availableUnits: projects.reduce((sum, p) => sum + p.available_units, 0),
      rating: builder.rating,
      reviewCount: builder.review_count
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
