const express = require('express');
const router = express.Router();
const { Project, Builder, Property, Review } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      status = 'approved',
      region,
      city,
      construction_status,
      project_type,
      min_price,
      max_price,
      search,
      builder_id
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { status };

    if (region) where.region = region;
    if (city) where.city = city;
    if (construction_status) where.construction_status = construction_status;
    if (project_type) where.project_type = project_type;
    if (builder_id) where.builder_id = builder_id;

    if (min_price || max_price) {
      where.min_price = {};
      if (min_price) where.min_price[Op.gte] = parseFloat(min_price);
      if (max_price) where.min_price[Op.lte] = parseFloat(max_price);
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: projects } = await Project.findAndCountAll({
      where,
      include: [
        {
          model: Builder,
          as: 'builder',
          attributes: ['id', 'name', 'company_name', 'logo', 'rating']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: projects,
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

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: Builder,
          as: 'builder'
        },
        {
          model: Property,
          as: 'properties',
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

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Increment views
    project.views_count += 1;
    await project.save();

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create project
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin' && req.user.role !== 'branch_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create projects'
      });
    }

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin' && req.user.role !== 'branch_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update projects'
      });
    }

    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can delete projects'
      });
    }

    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.destroy();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update construction status
router.patch('/:id/construction-status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin' && req.user.role !== 'branch_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update construction status'
      });
    }

    const { construction_status, completion_percentage } = req.body;

    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (construction_status) project.construction_status = construction_status;
    if (completion_percentage !== undefined) project.completion_percentage = completion_percentage;

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Construction status updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update unit availability
router.patch('/:id/units', authenticateToken, async (req, res) => {
  try {
    const { sold_units } = req.body;

    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (sold_units !== undefined) {
      project.sold_units = parseInt(sold_units);
      project.available_units = project.total_units - project.sold_units;
      await project.save();
    }

    res.status(200).json({
      success: true,
      message: 'Unit availability updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Approve/Reject project
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can change project status'
      });
    }

    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.status = status;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project ${status} successfully`,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get featured projects
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const projects = await Project.findAll({
      where: {
        status: 'approved',
        is_featured: true,
        is_active: true
      },
      include: [
        {
          model: Builder,
          as: 'builder',
          attributes: ['id', 'name', 'company_name', 'logo']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get new launches
router.get('/new-launches/list', async (req, res) => {
  try {
    const { limit = 6, region } = req.query;

    const where = {
      status: 'approved',
      construction_status: 'new_launch',
      is_active: true
    };

    if (region) where.region = region;

    const projects = await Project.findAll({
      where,
      include: [
        {
          model: Builder,
          as: 'builder',
          attributes: ['id', 'name', 'company_name', 'logo']
        }
      ],
      order: [['launch_date', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
