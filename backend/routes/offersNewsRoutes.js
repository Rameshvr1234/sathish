const express = require('express');
const router = express.Router();
const {
  getOffersNews,
  getSingleOfferNews,
  createOfferNews,
  updateOfferNews,
  deleteOfferNews,
  getActiveOffers
} = require('../controllers/offersNewsController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getOffersNews);
router.get('/active-offers', getActiveOffers);
router.get('/:id', getSingleOfferNews);

// Admin routes
router.post('/', protect, authorize('super_admin', 'branch_admin'), createOfferNews);
router.put('/:id', protect, authorize('super_admin', 'branch_admin'), updateOfferNews);
router.delete('/:id', protect, authorize('super_admin', 'branch_admin'), deleteOfferNews);

module.exports = router;
