const {
  ServiceBooking,
  SurveyBooking,
  LegalBooking,
  ConstructionBooking,
  FinanceBooking,
  User
} = require('../models');

// Price mapping for services
const pricingMap = {
  survey: {
    digital: 5000,
    land: 8000,
    dtcp_plot: 10000,
    house: 12000,
    commercial: 15000,
    industrial: 20000
  },
  legal: {
    sale_deed: 15000,
    gift_deed: 12000,
    legal_advice: 5000,
    documentation: 10000
  },
  construction: {
    '2d_3d_plan': 25000,
    '3d_elevation': 15000,
    plan_approval: 20000,
    vastu: 10000,
    walkthrough: 18000,
    interior: 50000,
    construction: 0 // Quote-based
  },
  finance: {
    home_loan: 0,
    plot_loan: 0,
    construction_loan: 0
  }
};

// @desc    Book survey service
// @route   POST /api/services/survey/book
// @access  Private
exports.bookSurveyService = async (req, res) => {
  try {
    const { service_sub_type, property_address, scheduled_date, additional_details } = req.body;
    const userId = req.user.id;

    const amount = pricingMap.survey[service_sub_type] || 0;

    // Create main booking
    const booking = await ServiceBooking.create({
      user_id: userId,
      service_type: 'survey',
      service_sub_type,
      amount,
      details: { property_address, additional_details },
      payment_status: 'pending',
      booking_status: 'pending',
      branch_id: req.user.branch_id || null
    });

    // Create survey-specific record
    await SurveyBooking.create({
      booking_id: booking.id,
      survey_type: service_sub_type,
      property_address,
      survey_date: scheduled_date
    });

    res.status(201).json({
      success: true,
      message: 'Survey booking created successfully',
      booking: {
        id: booking.id,
        service_type: booking.service_type,
        service_sub_type: booking.service_sub_type,
        amount: booking.amount,
        payment_status: booking.payment_status
      }
    });
  } catch (error) {
    console.error('Book survey error:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking survey service'
    });
  }
};

// @desc    Book legal service
// @route   POST /api/services/legal/book
// @access  Private
exports.bookLegalService = async (req, res) => {
  try {
    const { service_sub_type, property_details, consultation_date, additional_details } = req.body;
    const userId = req.user.id;

    const amount = pricingMap.legal[service_sub_type] || 0;

    // Create main booking
    const booking = await ServiceBooking.create({
      user_id: userId,
      service_type: 'legal',
      service_sub_type,
      amount,
      details: { property_details, additional_details },
      payment_status: 'pending',
      booking_status: 'pending',
      branch_id: req.user.branch_id || null
    });

    // Create legal-specific record
    await LegalBooking.create({
      booking_id: booking.id,
      legal_type: service_sub_type,
      property_details,
      consultation_date
    });

    res.status(201).json({
      success: true,
      message: 'Legal service booking created successfully',
      booking: {
        id: booking.id,
        service_type: booking.service_type,
        service_sub_type: booking.service_sub_type,
        amount: booking.amount,
        payment_status: booking.payment_status
      }
    });
  } catch (error) {
    console.error('Book legal service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking legal service'
    });
  }
};

// @desc    Book construction service
// @route   POST /api/services/construction/book
// @access  Private
exports.bookConstructionService = async (req, res) => {
  try {
    const {
      service_sub_type,
      project_details,
      start_date,
      estimated_completion,
      additional_details
    } = req.body;
    const userId = req.user.id;

    const amount = pricingMap.construction[service_sub_type] || 0;

    // Create main booking
    const booking = await ServiceBooking.create({
      user_id: userId,
      service_type: 'construction',
      service_sub_type,
      amount,
      details: { project_details, additional_details },
      payment_status: amount > 0 ? 'pending' : 'completed',
      booking_status: 'pending',
      branch_id: req.user.branch_id || null
    });

    // Create construction-specific record
    await ConstructionBooking.create({
      booking_id: booking.id,
      construction_type: service_sub_type,
      project_details,
      start_date,
      estimated_completion
    });

    res.status(201).json({
      success: true,
      message: service_sub_type === 'construction'
        ? 'Construction enquiry submitted. Our team will contact you for quote.'
        : 'Construction service booking created successfully',
      booking: {
        id: booking.id,
        service_type: booking.service_type,
        service_sub_type: booking.service_sub_type,
        amount: booking.amount,
        payment_status: booking.payment_status
      }
    });
  } catch (error) {
    console.error('Book construction service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking construction service'
    });
  }
};

// @desc    Submit finance enquiry (EMI calculation & loan application)
// @route   POST /api/services/finance/enquiry
// @access  Private
exports.submitFinanceEnquiry = async (req, res) => {
  try {
    const {
      loan_type,
      loan_amount,
      property_value,
      tenure_months,
      bank_name
    } = req.body;
    const userId = req.user.id;

    // Calculate EMI
    const interestRate = 8.5; // Default, can be fetched from bank tie-ups
    const monthlyRate = interestRate / 12 / 100;
    const emi = (loan_amount * monthlyRate * Math.pow(1 + monthlyRate, tenure_months)) /
                 (Math.pow(1 + monthlyRate, tenure_months) - 1);

    // Create main booking
    const booking = await ServiceBooking.create({
      user_id: userId,
      service_type: 'finance',
      service_sub_type: loan_type,
      amount: 0, // Finance service is free
      details: { loan_amount, property_value, tenure_months },
      payment_status: 'completed',
      booking_status: 'pending',
      branch_id: req.user.branch_id || null
    });

    // Create finance-specific record
    await FinanceBooking.create({
      booking_id: booking.id,
      loan_type,
      loan_amount,
      property_value,
      tenure_months,
      interest_rate: interestRate,
      emi_calculated: emi.toFixed(2),
      bank_name
    });

    res.status(201).json({
      success: true,
      message: 'Loan enquiry submitted successfully',
      booking: {
        id: booking.id,
        loan_type,
        loan_amount,
        tenure_months,
        interest_rate: interestRate,
        emi: emi.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Finance enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting finance enquiry'
    });
  }
};

// @desc    Calculate EMI
// @route   POST /api/services/finance/calculate-emi
// @access  Public
exports.calculateEMI = async (req, res) => {
  try {
    const { loan_amount, tenure_months, interest_rate = 8.5 } = req.body;

    const monthlyRate = interest_rate / 12 / 100;
    const emi = (loan_amount * monthlyRate * Math.pow(1 + monthlyRate, tenure_months)) /
                 (Math.pow(1 + monthlyRate, tenure_months) - 1);

    const totalAmount = emi * tenure_months;
    const totalInterest = totalAmount - loan_amount;

    res.json({
      success: true,
      calculation: {
        loan_amount,
        tenure_months,
        interest_rate,
        emi: emi.toFixed(2),
        total_amount: totalAmount.toFixed(2),
        total_interest: totalInterest.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating EMI'
    });
  }
};

// @desc    Get user's service bookings
// @route   GET /api/services/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await ServiceBooking.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: SurveyBooking, as: 'surveyDetails' },
        { model: LegalBooking, as: 'legalDetails' },
        { model: ConstructionBooking, as: 'constructionDetails' },
        { model: FinanceBooking, as: 'financeDetails' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

// @desc    Get single booking details
// @route   GET /api/services/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await ServiceBooking.findByPk(req.params.id, {
      include: [
        { model: SurveyBooking, as: 'surveyDetails' },
        { model: LegalBooking, as: 'legalDetails' },
        { model: ConstructionBooking, as: 'constructionDetails' },
        { model: FinanceBooking, as: 'financeDetails' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership or admin access
    if (booking.user_id !== req.user.id &&
        !['branch_admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking'
    });
  }
};

// @desc    Get bank tie-ups for finance
// @route   GET /api/services/finance/banks
// @access  Public
exports.getBankTieups = async (req, res) => {
  try {
    const banks = [
      {
        name: 'State Bank of India',
        logo: '/banks/sbi.png',
        interest_rate_min: 8.40,
        interest_rate_max: 9.65,
        features: ['Flexible repayment', 'No prepayment charges']
      },
      {
        name: 'HDFC Bank',
        logo: '/banks/hdfc.png',
        interest_rate_min: 8.50,
        interest_rate_max: 9.70,
        features: ['Quick approval', 'Digital process']
      },
      {
        name: 'ICICI Bank',
        logo: '/banks/icici.png',
        interest_rate_min: 8.60,
        interest_rate_max: 9.75,
        features: ['Balance transfer', 'Top-up loans']
      },
      {
        name: 'Axis Bank',
        logo: '/banks/axis.png',
        interest_rate_min: 8.55,
        interest_rate_max: 9.80,
        features: ['Low processing fees', 'Doorstep service']
      }
    ];

    res.json({
      success: true,
      banks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bank details'
    });
  }
};
