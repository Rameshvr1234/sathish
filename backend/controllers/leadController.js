const { Lead, SiteVisit, Property, User, Branch } = require('../models');
const { Op } = require('sequelize');

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res) => {
  try {
    const { property_id, name, email, phone, message } = req.body;
    const userId = req.user.id;

    // Get property details to determine branch
    const property = await Property.findByPk(property_id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const lead = await Lead.create({
      property_id,
      user_id: userId,
      branch_id: property.branch_id,
      name,
      email,
      phone,
      message,
      lead_source: 'website',
      lead_status: 'new'
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully. Property owner will contact you soon.',
      lead
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating lead'
    });
  }
};

// @desc    Get leads (filtered by role and branch)
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
  try {
    const { status, property_id, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    // Filter based on user role
    if (req.user.role === 'branch_admin') {
      where.branch_id = req.user.branch_id;
    } else if (req.user.role === 'seller') {
      // Get leads for user's properties
      const userProperties = await Property.findAll({
        where: { user_id: req.user.id },
        attributes: ['id']
      });
      where.property_id = {
        [Op.in]: userProperties.map(p => p.id)
      };
    } else if (req.user.role !== 'super_admin') {
      where.user_id = req.user.id;
    }

    if (status) where.lead_status = status;
    if (property_id) where.property_id = property_id;

    const { count, rows: leads } = await Lead.findAndCountAll({
      where,
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'location', 'property_type']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
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
      leads
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leads'
    });
  }
};

// @desc    Update lead status
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
  try {
    const { lead_status, notes, follow_up_date } = req.body;

    const lead = await Lead.findByPk(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check authorization
    if (req.user.role === 'branch_admin' && lead.branch_id !== req.user.branch_id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await lead.update({
      lead_status: lead_status || lead.lead_status,
      notes: notes || lead.notes,
      follow_up_date: follow_up_date || lead.follow_up_date
    });

    res.json({
      success: true,
      message: 'Lead updated successfully',
      lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating lead'
    });
  }
};

// @desc    Schedule site visit
// @route   POST /api/leads/:id/site-visit
// @access  Private
exports.scheduleSiteVisit = async (req, res) => {
  try {
    const { scheduled_date, scheduled_time } = req.body;
    const leadId = req.params.id;

    const lead = await Lead.findByPk(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    const siteVisit = await SiteVisit.create({
      lead_id: leadId,
      property_id: lead.property_id,
      user_id: lead.user_id,
      scheduled_date,
      scheduled_time,
      visit_status: 'scheduled'
    });

    // Update lead status
    await lead.update({ lead_status: 'site_visit_scheduled' });

    res.status(201).json({
      success: true,
      message: 'Site visit scheduled successfully',
      site_visit: siteVisit
    });
  } catch (error) {
    console.error('Schedule site visit error:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling site visit'
    });
  }
};

// @desc    Get site visits
// @route   GET /api/site-visits
// @access  Private
exports.getSiteVisits = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    // Filter based on user role
    if (req.user.role === 'branch_admin') {
      // Get site visits for branch properties
      const branchProperties = await Property.findAll({
        where: { branch_id: req.user.branch_id },
        attributes: ['id']
      });
      where.property_id = {
        [Op.in]: branchProperties.map(p => p.id)
      };
    } else if (req.user.role === 'seller') {
      // Get site visits for user's properties
      const userProperties = await Property.findAll({
        where: { user_id: req.user.id },
        attributes: ['id']
      });
      where.property_id = {
        [Op.in]: userProperties.map(p => p.id)
      };
    } else if (req.user.role !== 'super_admin') {
      where.user_id = req.user.id;
    }

    if (status) where.visit_status = status;

    const { count, rows: siteVisits } = await SiteVisit.findAndCountAll({
      where,
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'location', 'address']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Lead,
          as: 'lead',
          attributes: ['id', 'lead_status']
        }
      ],
      order: [['scheduled_date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      count,
      total_pages: Math.ceil(count / limit),
      current_page: parseInt(page),
      site_visits: siteVisits
    });
  } catch (error) {
    console.error('Get site visits error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching site visits'
    });
  }
};

// @desc    Update site visit status
// @route   PUT /api/site-visits/:id
// @access  Private
exports.updateSiteVisit = async (req, res) => {
  try {
    const { visit_status, feedback, interest_level, next_action } = req.body;

    const siteVisit = await SiteVisit.findByPk(req.params.id);

    if (!siteVisit) {
      return res.status(404).json({
        success: false,
        message: 'Site visit not found'
      });
    }

    await siteVisit.update({
      visit_status: visit_status || siteVisit.visit_status,
      feedback,
      interest_level,
      next_action
    });

    res.json({
      success: true,
      message: 'Site visit updated successfully',
      site_visit: siteVisit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating site visit'
    });
  }
};
