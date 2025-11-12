const { Property, Approval, User, Branch, PropertyImage } = require('../models');
const { Op } = require('sequelize');

// @desc    Get properties pending branch admin approval
// @route   GET /api/branch-admin/properties/pending
// @access  Private (Branch Admin)
exports.getBranchPendingProperties = async (req, res) => {
  try {
    const branchId = req.user.branch_id;

    const properties = await Property.findAll({
      where: {
        branch_id: branchId,
        status: 'pending'
      },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: PropertyImage,
          as: 'images',
          limit: 1
        }
      ],
      order: [['created_at', 'ASC']]
    });

    res.json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending properties'
    });
  }
};

// @desc    Branch admin approve property (sends to super admin)
// @route   POST /api/branch-admin/properties/:id/approve
// @access  Private (Branch Admin)
exports.branchAdminApprove = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const branchAdminId = req.user.id;

    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Verify property belongs to admin's branch
    if (property.branch_id !== req.user.branch_id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve this property'
      });
    }

    // Update property status
    await property.update({
      status: 'pending_super',
      approved_by_branch_admin: branchAdminId,
      branch_approval_at: new Date()
    });

    // Create approval record
    await Approval.create({
      property_id: id,
      approval_level: 'branch',
      approver_id: branchAdminId,
      approver_role: 'branch_admin',
      decision: 'approved',
      comments
    });

    res.json({
      success: true,
      message: 'Property approved and forwarded to Super Admin for final review'
    });
  } catch (error) {
    console.error('Branch admin approve error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving property'
    });
  }
};

// @desc    Branch admin reject property
// @route   POST /api/branch-admin/properties/:id/reject
// @access  Private (Branch Admin)
exports.branchAdminReject = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const branchAdminId = req.user.id;

    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Verify property belongs to admin's branch
    if (property.branch_id !== req.user.branch_id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this property'
      });
    }

    // Update property status
    await property.update({
      status: 'rejected',
      rejection_reason: reason
    });

    // Create approval record
    await Approval.create({
      property_id: id,
      approval_level: 'branch',
      approver_id: branchAdminId,
      approver_role: 'branch_admin',
      decision: 'rejected',
      comments: reason
    });

    res.json({
      success: true,
      message: 'Property rejected. Owner has been notified.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting property'
    });
  }
};

// @desc    Get properties pending super admin approval
// @route   GET /api/super-admin/properties/pending
// @access  Private (Super Admin)
exports.getSuperPendingProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: {
        status: 'pending_super'
      },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'name', 'region']
        },
        {
          model: PropertyImage,
          as: 'images',
          limit: 1
        },
        {
          model: Approval,
          as: 'approvals',
          where: { approval_level: 'branch' },
          required: false
        }
      ],
      order: [['branch_approval_at', 'ASC']]
    });

    res.json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending properties'
    });
  }
};

// @desc    Super admin final approval
// @route   POST /api/super-admin/properties/:id/approve
// @access  Private (Super Admin)
exports.superAdminApprove = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments, assignSvVerified } = req.body;
    const superAdminId = req.user.id;

    const property = await Property.findByPk(id, {
      include: [{ model: User, as: 'owner' }]
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Update property status
    await property.update({
      status: 'approved',
      approved_by_super_admin: superAdminId,
      super_approval_at: new Date(),
      sv_verified: assignSvVerified || false
    });

    // Create approval record
    await Approval.create({
      property_id: id,
      approval_level: 'super',
      approver_id: superAdminId,
      approver_role: 'super_admin',
      decision: 'approved',
      comments,
      sv_verified_assigned: assignSvVerified || false
    });

    res.json({
      success: true,
      message: `Property approved successfully${assignSvVerified ? ' with SV Verified badge' : ''}`,
      property
    });
  } catch (error) {
    console.error('Super admin approve error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving property'
    });
  }
};

// @desc    Super admin reject property
// @route   POST /api/super-admin/properties/:id/reject
// @access  Private (Super Admin)
exports.superAdminReject = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const superAdminId = req.user.id;

    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Update property status
    await property.update({
      status: 'rejected',
      rejection_reason: reason
    });

    // Create approval record
    await Approval.create({
      property_id: id,
      approval_level: 'super',
      approver_id: superAdminId,
      approver_role: 'super_admin',
      decision: 'rejected',
      comments: reason
    });

    res.json({
      success: true,
      message: 'Property rejected. Owner and branch admin have been notified.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting property'
    });
  }
};

// @desc    Assign/Remove SV Verified badge
// @route   POST /api/super-admin/properties/:id/sv-verify
// @access  Private (Super Admin)
exports.toggleSvVerified = async (req, res) => {
  try {
    const { id } = req.params;
    const { svVerified } = req.body;

    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    await property.update({ sv_verified: svVerified });

    res.json({
      success: true,
      message: svVerified ? 'SV Verified badge assigned' : 'SV Verified badge removed',
      property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating SV verified status'
    });
  }
};

// @desc    Get approval history for a property
// @route   GET /api/properties/:id/approvals
// @access  Private
exports.getPropertyApprovals = async (req, res) => {
  try {
    const approvals = await Approval.findAll({
      where: { property_id: req.params.id },
      include: [
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'name', 'role']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    res.json({
      success: true,
      approvals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching approval history'
    });
  }
};
