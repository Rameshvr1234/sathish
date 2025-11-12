const express = require('express');
const router = express.Router();
const {
  submitFinanceEnquiry,
  calculateEMI,
  getBankTieups,
  getMyBookings,
  getBooking
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.post('/calculate-emi', calculateEMI);
router.get('/banks', getBankTieups);
router.post('/enquiry', protect, submitFinanceEnquiry);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBooking);

module.exports = router;
