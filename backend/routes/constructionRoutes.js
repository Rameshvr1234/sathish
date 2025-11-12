const express = require('express');
const router = express.Router();
const { bookConstructionService, getMyBookings, getBooking } = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.post('/book', protect, bookConstructionService);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBooking);

module.exports = router;
