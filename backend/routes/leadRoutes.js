const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  updateLead,
  scheduleSiteVisit,
  getSiteVisits,
  updateSiteVisit
} = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createLead);
router.get('/', protect, getLeads);
router.put('/:id', protect, authorize('branch_admin', 'super_admin', 'seller'), updateLead);
router.post('/:id/site-visit', protect, scheduleSiteVisit);

// Site visits
router.get('/site-visits', protect, getSiteVisits);
router.put('/site-visits/:id', protect, authorize('branch_admin', 'super_admin', 'seller'), updateSiteVisit);

module.exports = router;
