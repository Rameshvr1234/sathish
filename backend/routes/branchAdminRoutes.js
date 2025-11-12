const express = require('express');
const router = express.Router();
const {
  getBranchPendingProperties,
  branchAdminApprove,
  branchAdminReject
} = require('../controllers/approvalController');
const {
  getBranchAdminDashboard,
  getBranchUsers
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require branch_admin role
router.use(protect, authorize('branch_admin'));

router.get('/dashboard', getBranchAdminDashboard);
router.get('/properties/pending', getBranchPendingProperties);
router.post('/properties/:id/approve', branchAdminApprove);
router.post('/properties/:id/reject', branchAdminReject);
router.get('/users', getBranchUsers);

module.exports = router;
