const express = require('express');
const router = express.Router();
const { bookSurveyService, getMyBookings, getBooking } = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.post('/book', protect, bookSurveyService);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBooking);

module.exports = router;
