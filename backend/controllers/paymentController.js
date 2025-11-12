const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Payment, ServiceBooking } = require('../models');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { booking_id, amount } = req.body;
    const userId = req.user.id;

    // Verify booking belongs to user
    const booking = await ServiceBooking.findByPk(booking_id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${booking_id}`,
      notes: {
        booking_id,
        user_id: userId,
        service_type: booking.service_type
      }
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    const payment = await Payment.create({
      user_id: userId,
      booking_id,
      razorpay_order_id: order.id,
      amount,
      currency: 'INR',
      payment_status: 'created'
    });

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      },
      payment_id: payment.id,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment order'
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Find payment record
    const payment = await Payment.findOne({
      where: { razorpay_order_id },
      include: [{ model: ServiceBooking, as: 'booking' }]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update payment status
      await payment.update({
        razorpay_payment_id,
        razorpay_signature,
        payment_status: 'paid'
      });

      // Update booking payment status
      if (payment.booking) {
        await payment.booking.update({
          payment_status: 'completed',
          booking_status: 'confirmed'
        });
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment
      });
    } else {
      // Payment verification failed
      await payment.update({
        payment_status: 'failed'
      });

      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
};

// @desc    Get user transactions
// @route   GET /api/payments/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: ServiceBooking,
          as: 'booking',
          attributes: ['id', 'service_type', 'service_sub_type']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: payments.length,
      transactions: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions'
    });
  }
};

// @desc    Process refund (Admin only)
// @route   POST /api/payments/refund
// @access  Private (Admin)
exports.processRefund = async (req, res) => {
  try {
    const { payment_id, amount, reason } = req.body;

    const payment = await Payment.findByPk(payment_id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Cannot refund unpaid transaction'
      });
    }

    // Process refund via Razorpay
    const refund = await razorpay.payments.refund(payment.razorpay_payment_id, {
      amount: Math.round(amount * 100) // Amount in paise
    });

    // Update payment record
    await payment.update({
      payment_status: 'refunded',
      refund_amount: amount,
      refund_reason: reason
    });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund'
    });
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments/all
// @access  Private (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.payment_status = status;

    const { count, rows: payments } = await Payment.findAndCountAll({
      where,
      include: [
        {
          model: ServiceBooking,
          as: 'booking',
          attributes: ['id', 'service_type', 'service_sub_type']
        },
        {
          model: require('../models').User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      count,
      total_pages: Math.ceil(count / limit),
      current_page: parseInt(page),
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments'
    });
  }
};
