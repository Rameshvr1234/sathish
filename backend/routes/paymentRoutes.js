const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getTransactions,
  processRefund,
  getAllPayments
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/transactions', protect, getTransactions);
router.post('/refund', protect, authorize('super_admin'), processRefund);
router.get('/all', protect, authorize('super_admin', 'branch_admin'), getAllPayments);

module.exports = router;
