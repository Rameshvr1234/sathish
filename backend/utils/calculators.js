/**
 * Financial Calculators for Real Estate Portal
 * Includes: EMI, Loan Eligibility, Stamp Duty, Property Tax, Rental Yield, Affordability
 */

/**
 * Calculate EMI (Equated Monthly Installment)
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (in percentage)
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {object} - EMI details
 */
const calculateEMI = (principal, annualRate, tenureMonths) => {
  const monthlyRate = annualRate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  const totalAmount = emi * tenureMonths;
  const totalInterest = totalAmount - principal;

  // Generate amortization schedule
  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= tenureMonths; month++) {
    const interestPaid = balance * monthlyRate;
    const principalPaid = emi - interestPaid;
    balance -= principalPaid;

    schedule.push({
      month,
      emi: Math.round(emi),
      principalPaid: Math.round(principalPaid),
      interestPaid: Math.round(interestPaid),
      balance: Math.round(Math.max(0, balance))
    });
  }

  return {
    emi: Math.round(emi),
    totalAmount: Math.round(totalAmount),
    totalInterest: Math.round(totalInterest),
    principal: Math.round(principal),
    monthlyRate: (monthlyRate * 100).toFixed(4),
    schedule: schedule.length > 120 ? schedule.filter((_, i) => i % 12 === 0) : schedule // Return yearly for long loans
  };
};

/**
 * Calculate Home Loan Eligibility
 * @param {number} monthlyIncome - Monthly income
 * @param {number} monthlyObligations - Existing monthly EMIs/obligations
 * @param {number} annualRate - Annual interest rate (in percentage)
 * @param {number} tenureYears - Loan tenure in years
 * @param {number} foir - Fixed Obligation to Income Ratio (default 0.5 = 50%)
 * @returns {object} - Eligibility details
 */
const calculateLoanEligibility = (monthlyIncome, monthlyObligations = 0, annualRate, tenureYears, foir = 0.5) => {
  const maxEMI = (monthlyIncome * foir) - monthlyObligations;

  if (maxEMI <= 0) {
    return {
      eligible: false,
      maxLoanAmount: 0,
      maxEMI: 0,
      message: 'Your existing obligations exceed 50% of your income. Not eligible for additional loan.'
    };
  }

  const tenureMonths = tenureYears * 12;
  const monthlyRate = annualRate / 12 / 100;

  // Calculate max loan amount using EMI formula
  const maxLoanAmount = (maxEMI * (Math.pow(1 + monthlyRate, tenureMonths) - 1)) /
                        (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths));

  return {
    eligible: true,
    maxLoanAmount: Math.round(maxLoanAmount),
    maxEMI: Math.round(maxEMI),
    monthlyIncome: Math.round(monthlyIncome),
    monthlyObligations: Math.round(monthlyObligations),
    availableForEMI: Math.round(maxEMI),
    foir: (foir * 100) + '%',
    tenure: tenureYears + ' years',
    interestRate: annualRate + '%'
  };
};

/**
 * Calculate Stamp Duty (State-wise)
 * @param {number} propertyValue - Property value
 * @param {string} state - State name
 * @param {string} gender - Buyer gender (male/female) - some states have different rates
 * @param {boolean} isResale - Is it a resale property
 * @returns {object} - Stamp duty details
 */
const calculateStampDuty = (propertyValue, state = 'Tamil Nadu', gender = 'male', isResale = false) => {
  // Stamp duty rates by state (as of 2024)
  const stampDutyRates = {
    'Tamil Nadu': { male: 0.07, female: 0.07, registration: 0.01 },
    'Karnataka': { male: 0.05, female: 0.05, registration: 0.01 },
    'Maharashtra': { male: 0.05, female: 0.04, registration: 0.01 },
    'Delhi': { male: 0.06, female: 0.04, registration: 0.01 },
    'Gujarat': { male: 0.049, female: 0.049, registration: 0.01 },
    'Telangana': { male: 0.04, female: 0.04, registration: 0.005 },
    'Kerala': { male: 0.08, female: 0.08, registration: 0.02 },
    'Rajasthan': { male: 0.055, female: 0.055, registration: 0.01 }
  };

  const rates = stampDutyRates[state] || stampDutyRates['Tamil Nadu'];
  const stampDutyRate = gender === 'female' ? rates.female : rates.male;

  const stampDuty = propertyValue * stampDutyRate;
  const registrationCharges = propertyValue * rates.registration;
  const total = stampDuty + registrationCharges;

  return {
    propertyValue: Math.round(propertyValue),
    state,
    stampDutyRate: (stampDutyRate * 100).toFixed(2) + '%',
    stampDuty: Math.round(stampDuty),
    registrationRate: (rates.registration * 100).toFixed(2) + '%',
    registrationCharges: Math.round(registrationCharges),
    totalCost: Math.round(total),
    breakdown: {
      stampDuty: Math.round(stampDuty),
      registration: Math.round(registrationCharges),
      gstOnRegistration: 0, // Typically no GST, but can be added
      legalCharges: 0, // Estimated
      miscCharges: 0
    }
  };
};

/**
 * Calculate Property Tax (Annual)
 * @param {number} propertyValue - Property value or annual rent
 * @param {string} city - City name
 * @param {string} propertyType - residential/commercial
 * @returns {object} - Property tax details
 */
const calculatePropertyTax = (propertyValue, city = 'Coimbatore', propertyType = 'residential') => {
  // Simplified property tax calculation (varies by city)
  // Usually based on rental value or capital value

  const taxRates = {
    'Coimbatore': { residential: 0.20, commercial: 0.30 }, // 20% of annual rental value
    'Chennai': { residential: 0.24, commercial: 0.36 },
    'Salem': { residential: 0.18, commercial: 0.28 },
    'Bangalore': { residential: 0.20, commercial: 0.30 }
  };

  const rates = taxRates[city] || taxRates['Coimbatore'];
  const rate = propertyType === 'commercial' ? rates.commercial : rates.residential;

  // Assuming property value, calculate annual rental value (ARV) as 10% of property value
  const annualRentalValue = propertyValue * 0.10;
  const propertyTax = annualRentalValue * rate;

  // Quarterly breakdown
  const quarterlyTax = propertyTax / 4;

  return {
    propertyValue: Math.round(propertyValue),
    city,
    propertyType,
    annualRentalValue: Math.round(annualRentalValue),
    taxRate: (rate * 100).toFixed(2) + '%',
    annualTax: Math.round(propertyTax),
    quarterlyTax: Math.round(quarterlyTax),
    monthlyTax: Math.round(propertyTax / 12),
    breakdown: {
      propertyTax: Math.round(propertyTax),
      waterCharges: Math.round(propertyValue * 0.0005), // 0.05%
      sewerageCharges: Math.round(propertyValue * 0.0005),
      otherCharges: 0
    }
  };
};

/**
 * Calculate Rental Yield
 * @param {number} propertyValue - Property purchase price
 * @param {number} monthlyRent - Expected/actual monthly rent
 * @param {number} maintenanceCost - Annual maintenance cost
 * @param {number} propertyTax - Annual property tax
 * @returns {object} - Rental yield details
 */
const calculateRentalYield = (propertyValue, monthlyRent, maintenanceCost = 0, propertyTax = 0) => {
  const annualRent = monthlyRent * 12;
  const annualExpenses = maintenanceCost + propertyTax;
  const netAnnualRent = annualRent - annualExpenses;

  const grossYield = (annualRent / propertyValue) * 100;
  const netYield = (netAnnualRent / propertyValue) * 100;

  // Calculate break-even years
  const breakEvenYears = propertyValue / netAnnualRent;

  return {
    propertyValue: Math.round(propertyValue),
    monthlyRent: Math.round(monthlyRent),
    annualRent: Math.round(annualRent),
    annualExpenses: Math.round(annualExpenses),
    netAnnualIncome: Math.round(netAnnualRent),
    grossYield: grossYield.toFixed(2) + '%',
    netYield: netYield.toFixed(2) + '%',
    breakEvenYears: breakEvenYears.toFixed(1),
    monthlyProfit: Math.round(netAnnualRent / 12),
    roi: netYield.toFixed(2) + '%',
    interpretation: netYield > 4 ? 'Good' : netYield > 2.5 ? 'Average' : 'Poor'
  };
};

/**
 * Calculate Affordability
 * @param {number} monthlyIncome - Monthly income
 * @param {number} downPayment - Available down payment
 * @param {number} annualRate - Interest rate
 * @param {number} tenureYears - Loan tenure
 * @param {number} monthlyObligations - Existing obligations
 * @returns {object} - Affordability details
 */
const calculateAffordability = (monthlyIncome, downPayment, annualRate, tenureYears, monthlyObligations = 0) => {
  // Calculate loan eligibility
  const eligibility = calculateLoanEligibility(monthlyIncome, monthlyObligations, annualRate, tenureYears);

  if (!eligibility.eligible) {
    return {
      affordable: false,
      ...eligibility
    };
  }

  const maxPropertyValue = eligibility.maxLoanAmount + downPayment;

  // Calculate stamp duty and registration
  const stampDuty = calculateStampDuty(maxPropertyValue);

  // Total cost including stamp duty
  const totalCostToBuy = maxPropertyValue + stampDuty.totalCost;

  // Recommended property range (conservative approach)
  const recommendedMin = maxPropertyValue * 0.7;
  const recommendedMax = maxPropertyValue;

  return {
    affordable: true,
    maxPropertyValue: Math.round(maxPropertyValue),
    maxLoanAmount: eligibility.maxLoanAmount,
    downPayment: Math.round(downPayment),
    maxEMI: eligibility.maxEMI,
    stampDutyAndRegistration: stampDuty.totalCost,
    totalCostToBuy: Math.round(totalCostToBuy),
    recommendedPriceRange: {
      min: Math.round(recommendedMin),
      max: Math.round(recommendedMax)
    },
    monthlyBreakdown: {
      income: Math.round(monthlyIncome),
      emi: eligibility.maxEMI,
      obligations: Math.round(monthlyObligations),
      remaining: Math.round(monthlyIncome - eligibility.maxEMI - monthlyObligations)
    }
  };
};

/**
 * Calculate Loan Comparison
 * @param {number} loanAmount - Loan amount
 * @param {number} tenureYears - Tenure in years
 * @param {array} banks - Array of bank objects with {name, rate}
 * @returns {array} - Comparison results
 */
const compareBankLoans = (loanAmount, tenureYears, banks) => {
  const tenureMonths = tenureYears * 12;

  return banks.map(bank => {
    const emi = calculateEMI(loanAmount, bank.rate, tenureMonths);
    return {
      bankName: bank.name,
      interestRate: bank.rate + '%',
      emi: emi.emi,
      totalInterest: emi.totalInterest,
      totalAmount: emi.totalAmount,
      processingFee: bank.processingFee || Math.round(loanAmount * 0.005), // 0.5% default
      savings: 0 // Will be calculated relative to highest
    };
  }).sort((a, b) => a.totalAmount - b.totalAmount)
    .map((result, index, arr) => ({
      ...result,
      savings: index > 0 ? arr[index].totalAmount - arr[0].totalAmount : 0,
      rank: index + 1
    }));
};

module.exports = {
  calculateEMI,
  calculateLoanEligibility,
  calculateStampDuty,
  calculatePropertyTax,
  calculateRentalYield,
  calculateAffordability,
  compareBankLoans
};
