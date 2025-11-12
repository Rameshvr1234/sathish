const express = require('express');
const router = express.Router();
const {
  getBranchLeadsReport,
  getBranchSiteVisitsReport,
  getBranchBookingsReport,
  getGlobalLeadsReport,
  getGlobalRevenueReport,
  getGlobalBookingsReport
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

// Branch reports
router.get('/branch/leads', protect, authorize('branch_admin'), getBranchLeadsReport);
router.get('/branch/site-visits', protect, authorize('branch_admin'), getBranchSiteVisitsReport);
router.get('/branch/bookings', protect, authorize('branch_admin'), getBranchBookingsReport);

// Global reports (Super Admin)
router.get('/global/leads', protect, authorize('super_admin'), getGlobalLeadsReport);
router.get('/global/revenue', protect, authorize('super_admin'), getGlobalRevenueReport);
router.get('/global/bookings', protect, authorize('super_admin'), getGlobalBookingsReport);

module.exports = router;
