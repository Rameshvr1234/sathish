const express = require('express');
const router = express.Router();
const { bookLegalService, getMyBookings, getBooking } = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.post('/book', protect, bookLegalService);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBooking);

module.exports = router;
