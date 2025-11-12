const {
  Property,
  ServiceBooking,
  Lead,
  SiteVisit,
  Payment,
  Branch
} = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// @desc    Branch leads report
// @route   GET /api/reports/branch/leads
// @access  Private (Branch Admin)
exports.getBranchLeadsReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const branchId = req.user.branch_id;

    const where = { branch_id: branchId };

    if (start_date && end_date) {
      where.created_at = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    const leads = await Lead.findAll({
      where,
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'location', 'property_type']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Group by status
    const leadsByStatus = await Lead.findAll({
      where,
      attributes: [
        'lead_status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['lead_status']
    });

    // Conversion rate
    const totalLeads = leads.length;
    const convertedLeads = leads.filter(l =>
      ['closed_won'].includes(l.lead_status)
    ).length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(2) : 0;

    res.json({
      success: true,
      report: {
        total_leads: totalLeads,
        converted_leads: convertedLeads,
        conversion_rate: conversionRate,
        by_status: leadsByStatus,
        leads
      }
    });
  } catch (error) {
    console.error('Branch leads report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating leads report'
    });
  }
};

// @desc    Branch site visits report
// @route   GET /api/reports/branch/site-visits
// @access  Private (Branch Admin)
exports.getBranchSiteVisitsReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const branchId = req.user.branch_id;

    // Get branch properties
    const branchProperties = await Property.findAll({
      where: { branch_id: branchId },
      attributes: ['id']
    });

    const propertyIds = branchProperties.map(p => p.id);

    const where = {
      property_id: { [Op.in]: propertyIds }
    };

    if (start_date && end_date) {
      where.scheduled_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    const siteVisits = await SiteVisit.findAll({
      where,
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'location']
        }
      ],
      order: [['scheduled_date', 'DESC']]
    });

    // Group by status
    const visitsByStatus = await SiteVisit.findAll({
      where,
      attributes: [
        'visit_status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['visit_status']
    });

    res.json({
      success: true,
      report: {
        total_visits: siteVisits.length,
        by_status: visitsByStatus,
        visits: siteVisits
      }
    });
  } catch (error) {
    console.error('Branch site visits report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating site visits report'
    });
  }
};

// @desc    Branch bookings report
// @route   GET /api/reports/branch/bookings
// @access  Private (Branch Admin)
exports.getBranchBookingsReport = async (req, res) => {
  try {
    const { start_date, end_date, service_type } = req.query;
    const branchId = req.user.branch_id;

    const where = { branch_id: branchId };

    if (start_date && end_date) {
      where.created_at = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    if (service_type) {
      where.service_type = service_type;
    }

    const bookings = await ServiceBooking.findAll({
      where,
      order: [['created_at', 'DESC']]
    });

    // Group by service type
    const bookingsByType = await ServiceBooking.findAll({
      where,
      attributes: [
        'service_type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
      ],
      group: ['service_type']
    });

    // Revenue
    const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.amount), 0);

    res.json({
      success: true,
      report: {
        total_bookings: bookings.length,
        total_revenue: totalRevenue.toFixed(2),
        by_type: bookingsByType,
        bookings
      }
    });
  } catch (error) {
    console.error('Branch bookings report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating bookings report'
    });
  }
};

// @desc    Global leads report (Super Admin)
// @route   GET /api/reports/global/leads
// @access  Private (Super Admin)
exports.getGlobalLeadsReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const where = {};

    if (start_date && end_date) {
      where.created_at = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    const totalLeads = await Lead.count({ where });

    // By branch
    const leadsByBranch = await Lead.findAll({
      where,
      attributes: [
        'branch_id',
        [sequelize.fn('COUNT', sequelize.col('Lead.id')), 'count']
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

    // By status
    const leadsByStatus = await Lead.findAll({
      where,
      attributes: [
        'lead_status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['lead_status']
    });

    res.json({
      success: true,
      report: {
        total_leads: totalLeads,
        by_branch: leadsByBranch,
        by_status: leadsByStatus
      }
    });
  } catch (error) {
    console.error('Global leads report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating global leads report'
    });
  }
};

// @desc    Global revenue report (Super Admin)
// @route   GET /api/reports/global/revenue
// @access  Private (Super Admin)
exports.getGlobalRevenueReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const where = { payment_status: 'paid' };

    if (start_date && end_date) {
      where.created_at = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    const totalRevenue = await Payment.sum('amount', { where });

    // By month
    const revenueByMonth = await Payment.findAll({
      where,
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'transaction_count']
      ],
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')), 'ASC']]
    });

    // By service type
    const revenueByService = await Payment.findAll({
      where,
      include: [
        {
          model: ServiceBooking,
          as: 'booking',
          attributes: ['service_type']
        }
      ],
      attributes: [
        [sequelize.col('booking.service_type'), 'service_type'],
        [sequelize.fn('SUM', sequelize.col('Payment.amount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('Payment.id')), 'count']
      ],
      group: ['booking.service_type']
    });

    res.json({
      success: true,
      report: {
        total_revenue: totalRevenue || 0,
        by_month: revenueByMonth,
        by_service: revenueByService
      }
    });
  } catch (error) {
    console.error('Global revenue report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating revenue report'
    });
  }
};

// @desc    Overall bookings report (Super Admin)
// @route   GET /api/reports/global/bookings
// @access  Private (Super Admin)
exports.getGlobalBookingsReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const where = {};

    if (start_date && end_date) {
      where.created_at = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    const totalBookings = await ServiceBooking.count({ where });

    // By service type
    const bookingsByType = await ServiceBooking.findAll({
      where,
      attributes: [
        'service_type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
      ],
      group: ['service_type']
    });

    // By status
    const bookingsByStatus = await ServiceBooking.findAll({
      where,
      attributes: [
        'booking_status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['booking_status']
    });

    res.json({
      success: true,
      report: {
        total_bookings: totalBookings,
        by_type: bookingsByType,
        by_status: bookingsByStatus
      }
    });
  } catch (error) {
    console.error('Global bookings report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating bookings report'
    });
  }
};
