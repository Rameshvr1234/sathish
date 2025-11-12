const express = require('express');
const router = express.Router();
const {
  getSuperPendingProperties,
  superAdminApprove,
  superAdminReject,
  toggleSvVerified,
  getPropertyApprovals
} = require('../controllers/approvalController');
const {
  getSuperAdminDashboard,
  createBranch,
  createBranchAdmin,
  getAllBranches
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require super_admin role
router.use(protect, authorize('super_admin'));

router.get('/dashboard', getSuperAdminDashboard);
router.get('/properties/pending', getSuperPendingProperties);
router.post('/properties/:id/approve', superAdminApprove);
router.post('/properties/:id/reject', superAdminReject);
router.post('/properties/:id/sv-verify', toggleSvVerified);
router.get('/properties/:id/approvals', getPropertyApprovals);
router.post('/branches', createBranch);
router.post('/branch-admins', createBranchAdmin);
router.get('/branches', getAllBranches);

module.exports = router;
