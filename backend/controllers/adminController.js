const {
  Property,
  ServiceBooking,
  Lead,
  SiteVisit,
  Payment,
  User,
  Branch
} = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// @desc    Branch Admin Dashboard Stats
// @route   GET /api/branch-admin/dashboard
// @access  Private (Branch Admin)
exports.getBranchAdminDashboard = async (req, res) => {
  try {
    const branchId = req.user.branch_id;

    // Properties stats
    const propertiesStats = await Property.count({
      where: { branch_id: branchId },
      group: ['status']
    });

    const totalProperties = await Property.count({
      where: { branch_id: branchId }
    });

    const pendingApprovals = await Property.count({
      where: {
        branch_id: branchId,
        status: 'pending'
      }
    });

    // Service bookings
    const totalBookings = await ServiceBooking.count({
      where: { branch_id: branchId }
    });

    const bookingsByStatus = await ServiceBooking.findAll({
      where: { branch_id: branchId },
      attributes: [
        'booking_status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['booking_status']
    });

    // Leads stats
    const totalLeads = await Lead.count({
      where: { branch_id: branchId }
    });

    const newLeads = await Lead.count({
      where: {
        branch_id: branchId,
        lead_status: 'new'
      }
    });

    // Site visits
    const totalSiteVisits = await SiteVisit.count({
      where: {
        property_id: {
          [Op.in]: sequelize.literal(`(SELECT id FROM properties WHERE branch_id = '${branchId}')`)
        }
      }
    });

    const upcomingSiteVisits = await SiteVisit.count({
      where: {
        property_id: {
          [Op.in]: sequelize.literal(`(SELECT id FROM properties WHERE branch_id = '${branchId}')`)
        },
        visit_status: 'scheduled',
        scheduled_date: {
          [Op.gte]: new Date()
        }
      }
    });

    // Revenue stats
    const totalRevenue = await Payment.sum('amount', {
      where: {
        payment_status: 'paid',
        booking_id: {
          [Op.in]: sequelize.literal(`(SELECT id FROM service_bookings WHERE branch_id = '${branchId}')`)
        }
      }
    });

    res.json({
      success: true,
      dashboard: {
        properties: {
          total: totalProperties,
          pending_approval: pendingApprovals,
          by_status: propertiesStats
        },
        bookings: {
          total: totalBookings,
          by_status: bookingsByStatus
        },
        leads: {
          total: totalLeads,
          new: newLeads
        },
        site_visits: {
          total: totalSiteVisits,
          upcoming: upcomingSiteVisits
        },
        revenue: {
          total: totalRevenue || 0
        }
      }
    });
  } catch (error) {
    console.error('Branch admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
};

// @desc    Super Admin Dashboard Stats
// @route   GET /api/super-admin/dashboard
// @access  Private (Super Admin)
exports.getSuperAdminDashboard = async (req, res) => {
  try {
    // Overall properties stats
    const totalProperties = await Property.count();

    const propertiesByStatus = await Property.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const pendingSuperApproval = await Property.count({
      where: { status: 'pending_super' }
    });

    const svVerifiedCount = await Property.count({
      where: { sv_verified: true }
    });

    // Properties by branch
    const propertiesByBranch = await Property.findAll({
      attributes: [
        'branch_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['name', 'region']
        }
      ],
      group: ['branch_id', 'branch.id']
    });

    // Service bookings
    const totalBookings = await ServiceBooking.count();

    const bookingsByType = await ServiceBooking.findAll({
      attributes: [
        'service_type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['service_type']
    });

    // Leads and conversions
    const totalLeads = await Lead.count();

    const leadsByStatus = await Lead.findAll({
      attributes: [
        'lead_status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['lead_status']
    });

    // Site visits
    const totalSiteVisits = await SiteVisit.count();

    // Revenue stats
    const totalRevenue = await Payment.sum('amount', {
      where: { payment_status: 'paid' }
    });

    const revenueByMonth = await Payment.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'revenue']
      ],
      where: {
        payment_status: 'paid',
        created_at: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 6))
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')), 'ASC']]
    });

    // Users stats
    const totalUsers = await User.count();

    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['role']
    });

    // Branches stats
    const totalBranches = await Branch.count({ where: { is_active: true } });

    res.json({
      success: true,
      dashboard: {
        properties: {
          total: totalProperties,
          pending_super_approval: pendingSuperApproval,
          sv_verified: svVerifiedCount,
          by_status: propertiesByStatus,
          by_branch: propertiesByBranch
        },
        bookings: {
          total: totalBookings,
          by_type: bookingsByType
        },
        leads: {
          total: totalLeads,
          by_status: leadsByStatus
        },
        site_visits: {
          total: totalSiteVisits
        },
        revenue: {
          total: totalRevenue || 0,
          by_month: revenueByMonth
        },
        users: {
          total: totalUsers,
          by_role: usersByRole
        },
        branches: {
          total: totalBranches
        }
      }
    });
  } catch (error) {
    console.error('Super admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
};

// @desc    Get branch users
// @route   GET /api/branch-admin/users
// @access  Private (Branch Admin)
exports.getBranchUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { branch_id: req.user.branch_id },
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// @desc    Create branch (Super Admin only)
// @route   POST /api/super-admin/branches
// @access  Private (Super Admin)
exports.createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      branch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating branch'
    });
  }
};

// @desc    Create branch admin (Super Admin only)
// @route   POST /api/super-admin/branch-admins
// @access  Private (Super Admin)
exports.createBranchAdmin = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const { name, email, phone, password, branch_id } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const branchAdmin = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'branch_admin',
      branch_id
    });

    res.status(201).json({
      success: true,
      message: 'Branch admin created successfully',
      user: {
        id: branchAdmin.id,
        name: branchAdmin.name,
        email: branchAdmin.email,
        role: branchAdmin.role,
        branch_id: branchAdmin.branch_id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating branch admin'
    });
  }
};

// @desc    Get all branches
// @route   GET /api/branches
// @access  Private (Admin)
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.findAll({
      where: { is_active: true },
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name', 'role']
        }
      ]
    });

    res.json({
      success: true,
      count: branches.length,
      branches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching branches'
    });
  }
};
