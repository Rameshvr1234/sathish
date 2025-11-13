const express = require('express');
const router = express.Router();
const {
  calculateEMI,
  calculateLoanEligibility,
  calculateStampDuty,
  calculatePropertyTax,
  calculateRentalYield,
  calculateAffordability,
  compareBankLoans
} = require('../utils/calculators');

// EMI Calculator
router.post('/emi', (req, res) => {
  try {
    const { principal, annualRate, tenureMonths } = req.body;

    if (!principal || !annualRate || !tenureMonths) {
      return res.status(400).json({
        success: false,
        message: 'Please provide principal, annualRate, and tenureMonths'
      });
    }

    const result = calculateEMI(
      parseFloat(principal),
      parseFloat(annualRate),
      parseInt(tenureMonths)
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Loan Eligibility Calculator
router.post('/eligibility', (req, res) => {
  try {
    const { monthlyIncome, monthlyObligations, annualRate, tenureYears, foir } = req.body;

    if (!monthlyIncome || !annualRate || !tenureYears) {
      return res.status(400).json({
        success: false,
        message: 'Please provide monthlyIncome, annualRate, and tenureYears'
      });
    }

    const result = calculateLoanEligibility(
      parseFloat(monthlyIncome),
      parseFloat(monthlyObligations || 0),
      parseFloat(annualRate),
      parseInt(tenureYears),
      parseFloat(foir || 0.5)
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Stamp Duty Calculator
router.post('/stamp-duty', (req, res) => {
  try {
    const { propertyValue, state, gender, isResale } = req.body;

    if (!propertyValue) {
      return res.status(400).json({
        success: false,
        message: 'Please provide propertyValue'
      });
    }

    const result = calculateStampDuty(
      parseFloat(propertyValue),
      state || 'Tamil Nadu',
      gender || 'male',
      isResale || false
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Property Tax Calculator
router.post('/property-tax', (req, res) => {
  try {
    const { propertyValue, city, propertyType } = req.body;

    if (!propertyValue) {
      return res.status(400).json({
        success: false,
        message: 'Please provide propertyValue'
      });
    }

    const result = calculatePropertyTax(
      parseFloat(propertyValue),
      city || 'Coimbatore',
      propertyType || 'residential'
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Rental Yield Calculator
router.post('/rental-yield', (req, res) => {
  try {
    const { propertyValue, monthlyRent, maintenanceCost, propertyTax } = req.body;

    if (!propertyValue || !monthlyRent) {
      return res.status(400).json({
        success: false,
        message: 'Please provide propertyValue and monthlyRent'
      });
    }

    const result = calculateRentalYield(
      parseFloat(propertyValue),
      parseFloat(monthlyRent),
      parseFloat(maintenanceCost || 0),
      parseFloat(propertyTax || 0)
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Affordability Calculator
router.post('/affordability', (req, res) => {
  try {
    const { monthlyIncome, downPayment, annualRate, tenureYears, monthlyObligations } = req.body;

    if (!monthlyIncome || !downPayment || !annualRate || !tenureYears) {
      return res.status(400).json({
        success: false,
        message: 'Please provide monthlyIncome, downPayment, annualRate, and tenureYears'
      });
    }

    const result = calculateAffordability(
      parseFloat(monthlyIncome),
      parseFloat(downPayment),
      parseFloat(annualRate),
      parseInt(tenureYears),
      parseFloat(monthlyObligations || 0)
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Compare Bank Loans
router.post('/compare-loans', (req, res) => {
  try {
    const { loanAmount, tenureYears, banks } = req.body;

    if (!loanAmount || !tenureYears || !banks || !Array.isArray(banks)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide loanAmount, tenureYears, and banks array'
      });
    }

    const result = compareBankLoans(
      parseFloat(loanAmount),
      parseInt(tenureYears),
      banks
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all calculator info (for frontend)
router.get('/info', (req, res) => {
  res.status(200).json({
    success: true,
    calculators: [
      {
        name: 'EMI Calculator',
        endpoint: '/api/calculators/emi',
        description: 'Calculate monthly EMI for home loans',
        parameters: ['principal', 'annualRate', 'tenureMonths']
      },
      {
        name: 'Loan Eligibility',
        endpoint: '/api/calculators/eligibility',
        description: 'Check how much loan you can get',
        parameters: ['monthlyIncome', 'monthlyObligations', 'annualRate', 'tenureYears']
      },
      {
        name: 'Stamp Duty',
        endpoint: '/api/calculators/stamp-duty',
        description: 'Calculate stamp duty and registration charges',
        parameters: ['propertyValue', 'state', 'gender']
      },
      {
        name: 'Property Tax',
        endpoint: '/api/calculators/property-tax',
        description: 'Estimate annual property tax',
        parameters: ['propertyValue', 'city', 'propertyType']
      },
      {
        name: 'Rental Yield',
        endpoint: '/api/calculators/rental-yield',
        description: 'Calculate rental returns on investment',
        parameters: ['propertyValue', 'monthlyRent', 'maintenanceCost', 'propertyTax']
      },
      {
        name: 'Affordability',
        endpoint: '/api/calculators/affordability',
        description: 'Find out how much property you can afford',
        parameters: ['monthlyIncome', 'downPayment', 'annualRate', 'tenureYears']
      },
      {
        name: 'Compare Loans',
        endpoint: '/api/calculators/compare-loans',
        description: 'Compare home loans from different banks',
        parameters: ['loanAmount', 'tenureYears', 'banks']
      }
    ],
    defaultBanks: [
      { name: 'SBI', rate: 8.5, processingFee: 10000 },
      { name: 'HDFC', rate: 8.75, processingFee: 8000 },
      { name: 'ICICI', rate: 8.65, processingFee: 9000 },
      { name: 'Axis Bank', rate: 8.80, processingFee: 7500 },
      { name: 'Punjab National Bank', rate: 8.55, processingFee: 8500 },
      { name: 'Canara Bank', rate: 8.60, processingFee: 9000 },
      { name: 'Bank of Baroda', rate: 8.70, processingFee: 8000 },
      { name: 'Kotak Mahindra', rate: 8.90, processingFee: 7000 }
    ]
  });
});

module.exports = router;
