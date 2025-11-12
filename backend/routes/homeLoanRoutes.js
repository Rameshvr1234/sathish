const express = require('express');
const router = express.Router();
const { HomeLoanApplication, Property, User } = require('../models');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

// Bank partners configuration (can be moved to database)
const BANK_PARTNERS = [
  {
    name: 'HDFC Bank',
    interest_rates: { min: 8.5, max: 9.5 },
    max_tenure: 30,
    processing_fee_percent: 0.5,
    min_down_payment_percent: 20
  },
  {
    name: 'ICICI Bank',
    interest_rates: { min: 8.6, max: 9.6 },
    max_tenure: 30,
    processing_fee_percent: 0.5,
    min_down_payment_percent: 20
  },
  {
    name: 'SBI',
    interest_rates: { min: 8.4, max: 9.4 },
    max_tenure: 30,
    processing_fee_percent: 0.35,
    min_down_payment_percent: 20
  },
  {
    name: 'Axis Bank',
    interest_rates: { min: 8.75, max: 9.75 },
    max_tenure: 30,
    processing_fee_percent: 0.5,
    min_down_payment_percent: 20
  },
  {
    name: 'Kotak Mahindra Bank',
    interest_rates: { min: 8.7, max: 9.7 },
    max_tenure: 30,
    processing_fee_percent: 0.5,
    min_down_payment_percent: 20
  }
];

// Calculate EMI
const calculateEMI = (principal, annualRate, tenureMonths) => {
  const monthlyRate = annualRate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
};

// Calculate loan eligibility
const calculateEligibility = (monthlyIncome, existingEMI, age = 30) => {
  // Typically, banks allow 50-60% of income towards EMI
  const maxEMIAllowed = monthlyIncome * 0.5 - existingEMI;

  // Assuming 9% interest and 20 years tenure for eligibility calculation
  const rate = 9 / 12 / 100;
  const tenure = 20 * 12;

  const eligibleAmount = maxEMIAllowed * (Math.pow(1 + rate, tenure) - 1) /
    (rate * Math.pow(1 + rate, tenure));

  return Math.round(eligibleAmount);
};

// Generate application number
const generateApplicationNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `HLA${timestamp}${random}`;
};

// @route   GET /api/home-loans/banks
// @desc    Get list of bank partners
// @access  Public
router.get('/banks', (req, res) => {
  res.json({
    success: true,
    data: BANK_PARTNERS
  });
});

// @route   POST /api/home-loans/calculate-eligibility
// @desc    Calculate loan eligibility
// @access  Public
router.post('/calculate-eligibility', (req, res) => {
  try {
    const { monthly_income, existing_emi = 0, age = 30 } = req.body;

    if (!monthly_income || monthly_income <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid monthly income is required'
      });
    }

    const eligibilityAmount = calculateEligibility(
      parseFloat(monthly_income),
      parseFloat(existing_emi),
      parseInt(age)
    );

    // Calculate for different tenures
    const tenureOptions = [10, 15, 20, 25, 30];
    const emiOptions = tenureOptions.map(years => {
      const months = years * 12;
      const emi = calculateEMI(eligibilityAmount, 9, months);
      return {
        tenure_years: years,
        tenure_months: months,
        emi_amount: emi,
        total_payment: emi * months,
        total_interest: (emi * months) - eligibilityAmount
      };
    });

    res.json({
      success: true,
      data: {
        eligible_amount: eligibilityAmount,
        monthly_income: parseFloat(monthly_income),
        existing_emi: parseFloat(existing_emi),
        max_emi_allowed: parseFloat(monthly_income) * 0.5,
        emi_options: emiOptions
      }
    });
  } catch (error) {
    console.error('Error calculating eligibility:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/home-loans/calculate-emi
// @desc    Calculate EMI for given parameters
// @access  Public
router.post('/calculate-emi', (req, res) => {
  try {
    const { loan_amount, interest_rate, tenure_months } = req.body;

    if (!loan_amount || !interest_rate || !tenure_months) {
      return res.status(400).json({
        success: false,
        message: 'Loan amount, interest rate, and tenure are required'
      });
    }

    const emi = calculateEMI(
      parseFloat(loan_amount),
      parseFloat(interest_rate),
      parseInt(tenure_months)
    );

    const totalPayment = emi * tenure_months;
    const totalInterest = totalPayment - parseFloat(loan_amount);

    // Generate amortization schedule (first 12 months + yearly summary)
    const schedule = [];
    let balance = parseFloat(loan_amount);
    const monthlyRate = parseFloat(interest_rate) / 12 / 100;

    for (let month = 1; month <= Math.min(12, tenure_months); month++) {
      const interestAmount = balance * monthlyRate;
      const principalAmount = emi - interestAmount;
      balance -= principalAmount;

      schedule.push({
        month,
        emi,
        principal: Math.round(principalAmount),
        interest: Math.round(interestAmount),
        balance: Math.round(balance)
      });
    }

    res.json({
      success: true,
      data: {
        loan_amount: parseFloat(loan_amount),
        interest_rate: parseFloat(interest_rate),
        tenure_months: parseInt(tenure_months),
        tenure_years: (parseInt(tenure_months) / 12).toFixed(1),
        emi_amount: emi,
        total_payment: Math.round(totalPayment),
        total_interest: Math.round(totalInterest),
        schedule: schedule
      }
    });
  } catch (error) {
    console.error('Error calculating EMI:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/home-loans/my-applications
// @desc    Get user's loan applications
// @access  Private
router.get('/my-applications', protect, async (req, res) => {
  try {
    const { status } = req.query;

    const whereClause = { user_id: req.user.id };
    if (status) whereClause.status = status;

    const applications = await HomeLoanApplication.findAll({
      where: whereClause,
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'property_type', 'price', 'location', 'city']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching loan applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/home-loans/apply
// @desc    Submit home loan application
// @access  Private
router.post('/apply', protect, async (req, res) => {
  try {
    const {
      property_id,
      bank_name,
      loan_type,
      loan_amount,
      property_value,
      down_payment,
      interest_rate,
      tenure_months,
      applicant_name,
      applicant_email,
      applicant_phone,
      applicant_pan,
      applicant_aadhar,
      employment_type,
      monthly_income,
      company_name,
      work_experience_years,
      existing_loans,
      credit_score,
      co_applicants
    } = req.body;

    // Validate required fields
    if (!bank_name || !loan_amount || !property_value || !down_payment ||
        !interest_rate || !tenure_months || !applicant_name ||
        !applicant_email || !applicant_phone || !employment_type || !monthly_income) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate property if specified
    if (property_id) {
      const property = await Property.findByPk(property_id);
      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      }
    }

    // Calculate EMI
    const emiAmount = calculateEMI(
      parseFloat(loan_amount),
      parseFloat(interest_rate),
      parseInt(tenure_months)
    );

    // Calculate eligibility
    const totalExistingEMI = existing_loans ?
      existing_loans.reduce((sum, loan) => sum + (loan.emi || 0), 0) : 0;

    const eligibilityAmount = calculateEligibility(
      parseFloat(monthly_income),
      totalExistingEMI
    );

    // Find bank config for processing fee
    const bankConfig = BANK_PARTNERS.find(b => b.name === bank_name);
    const processingFee = bankConfig ?
      (parseFloat(loan_amount) * bankConfig.processing_fee_percent / 100) : 0;

    // Generate application number
    const applicationNumber = generateApplicationNumber();

    const application = await HomeLoanApplication.create({
      user_id: req.user.id,
      property_id: property_id || null,
      application_number: applicationNumber,
      bank_name,
      loan_type: loan_type || 'home_loan',
      loan_amount: parseFloat(loan_amount),
      property_value: parseFloat(property_value),
      down_payment: parseFloat(down_payment),
      interest_rate: parseFloat(interest_rate),
      tenure_months: parseInt(tenure_months),
      emi_amount: emiAmount,
      applicant_name,
      applicant_email,
      applicant_phone,
      applicant_pan: applicant_pan || null,
      applicant_aadhar: applicant_aadhar || null,
      employment_type,
      monthly_income: parseFloat(monthly_income),
      company_name: company_name || null,
      work_experience_years: work_experience_years || null,
      existing_loans: existing_loans || [],
      total_existing_emi: totalExistingEMI,
      credit_score: credit_score || null,
      co_applicants: co_applicants || [],
      eligibility_amount: eligibilityAmount,
      processing_fee: processingFee,
      status: 'draft'
    });

    res.status(201).json({
      success: true,
      message: 'Loan application created successfully',
      data: application
    });
  } catch (error) {
    console.error('Error creating loan application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/home-loans/:id
// @desc    Update loan application
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const application = await HomeLoanApplication.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'draft' && application.status !== 'documents_required') {
      return res.status(400).json({
        success: false,
        message: 'Application cannot be edited in current status'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'applicant_name', 'applicant_email', 'applicant_phone', 'applicant_pan',
      'applicant_aadhar', 'employment_type', 'monthly_income', 'company_name',
      'work_experience_years', 'existing_loans', 'credit_score', 'co_applicants',
      'documents'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await application.update(updates);

    res.json({
      success: true,
      message: 'Application updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Error updating loan application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/home-loans/:id/submit
// @desc    Submit loan application for review
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const application = await HomeLoanApplication.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Application is already submitted'
      });
    }

    await application.update({
      status: 'submitted',
      submitted_at: new Date()
    });

    // TODO: Send notification to bank/admin

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Error submitting loan application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/home-loans/:id
// @desc    Get loan application details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await HomeLoanApplication.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'property_type', 'price', 'location', 'city', 'region']
        }
      ]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching loan application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
