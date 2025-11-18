const PrintCostingAgent = require('../models/PrintCostingAgent');
const { Op } = require('sequelize');

// Calculate printing cost - Expert logic
exports.calculatePrintCost = async (req, res) => {
  try {
    const {
      paperSize = 'A4',
      paperType = 'standard_80gsm',
      printType = 'black_and_white',
      quantity,
      sides = 'single',
      binding = 'none',
      lamination = 'none',
      finishing = { folding: false, punching: false, trimming: false, embossing: false },
      urgency = 'standard',
      documentType = 'custom_document'
    } = req.body;

    // Validate required fields
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required and must be at least 1'
      });
    }

    // Calculate cost using expert logic
    const costData = PrintCostingAgent.calculateCost({
      paperSize,
      paperType,
      printType,
      quantity,
      sides,
      binding,
      lamination,
      finishing,
      urgency,
      documentType
    });

    // Get expert recommendations
    const recommendations = PrintCostingAgent.getExpertRecommendations(documentType, quantity);

    res.json({
      success: true,
      message: 'Print cost calculated successfully',
      data: {
        cost: costData,
        expertRecommendations: recommendations,
        requestedSpecs: {
          paperSize,
          paperType,
          printType,
          quantity,
          sides,
          binding,
          lamination,
          finishing,
          urgency,
          documentType
        }
      }
    });

  } catch (error) {
    console.error('Calculate print cost error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating print cost',
      error: error.message
    });
  }
};

// Create a print costing quote
exports.createQuote = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      documentType,
      paperSize = 'A4',
      paperType = 'standard_80gsm',
      printType = 'black_and_white',
      quantity,
      sides = 'single',
      binding = 'none',
      lamination = 'none',
      finishing = { folding: false, punching: false, trimming: false, embossing: false },
      urgency = 'standard',
      notes
    } = req.body;

    // Validate required fields
    if (!documentType || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Document type and quantity are required'
      });
    }

    // Calculate cost
    const costData = PrintCostingAgent.calculateCost({
      paperSize,
      paperType,
      printType,
      quantity,
      sides,
      binding,
      lamination,
      finishing,
      urgency,
      documentType
    });

    // Create quote record
    const quote = await PrintCostingAgent.create({
      userId,
      documentType,
      paperSize,
      paperType,
      printType,
      quantity,
      sides,
      binding,
      lamination,
      finishing,
      urgency,
      baseCost: costData.baseCost,
      paperCost: costData.paperCost,
      printingCost: costData.printingCost,
      bindingCost: costData.bindingCost,
      finishingCost: costData.finishingCost,
      urgencyCost: costData.urgencyCost,
      discountAmount: costData.discountAmount,
      totalCost: costData.totalCost,
      costBreakdown: costData.costBreakdown,
      status: 'quoted',
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Print quote created successfully',
      data: {
        quote,
        expertAdvice: this.getExpertAdvice(costData.costBreakdown)
      }
    });

  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating print quote',
      error: error.message
    });
  }
};

// Get user's print quotes
exports.getUserQuotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const whereClause = { userId };
    if (status) {
      whereClause.status = status;
    }

    const offset = (page - 1) * limit;

    const quotes = await PrintCostingAgent.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await PrintCostingAgent.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        quotes,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get user quotes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quotes',
      error: error.message
    });
  }
};

// Get quote by ID
exports.getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const quote = await PrintCostingAgent.findOne({
      where: { id, userId }
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    res.json({
      success: true,
      data: quote
    });

  } catch (error) {
    console.error('Get quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quote',
      error: error.message
    });
  }
};

// Update quote status
exports.updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status, notes } = req.body;

    const validStatuses = ['quoted', 'confirmed', 'in_production', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const quote = await PrintCostingAgent.findOne({
      where: { id, userId }
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    quote.status = status;
    if (notes) {
      quote.notes = notes;
    }
    await quote.save();

    res.json({
      success: true,
      message: 'Quote status updated successfully',
      data: quote
    });

  } catch (error) {
    console.error('Update quote status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating quote status',
      error: error.message
    });
  }
};

// Compare different print options
exports.comparePrintOptions = async (req, res) => {
  try {
    const { quantity, documentType } = req.body;

    if (!quantity || !documentType) {
      return res.status(400).json({
        success: false,
        message: 'Quantity and document type are required'
      });
    }

    // Define comparison scenarios
    const scenarios = [
      {
        name: 'Budget Option',
        specs: {
          paperSize: 'A4',
          paperType: 'standard_80gsm',
          printType: 'black_and_white',
          sides: 'double',
          binding: 'staple',
          lamination: 'none',
          finishing: { folding: false, punching: false, trimming: false, embossing: false },
          urgency: 'standard'
        }
      },
      {
        name: 'Standard Option',
        specs: {
          paperSize: 'A4',
          paperType: 'premium_100gsm',
          printType: 'color',
          sides: 'double',
          binding: 'spiral',
          lamination: 'none',
          finishing: { folding: false, punching: false, trimming: false, embossing: false },
          urgency: 'standard'
        }
      },
      {
        name: 'Premium Option',
        specs: {
          paperSize: 'A4',
          paperType: 'glossy_130gsm',
          printType: 'full_color_photo',
          sides: 'double',
          binding: 'perfect_bound',
          lamination: 'gloss',
          finishing: { folding: false, punching: false, trimming: true, embossing: false },
          urgency: 'standard'
        }
      },
      {
        name: 'Luxury Option',
        specs: {
          paperSize: 'A4',
          paperType: 'cardstock_250gsm',
          printType: 'full_color_photo',
          sides: 'double',
          binding: 'hardcover',
          lamination: 'gloss',
          finishing: { folding: false, punching: false, trimming: true, embossing: true },
          urgency: 'standard'
        }
      }
    ];

    // Calculate costs for each scenario
    const comparisons = scenarios.map(scenario => {
      const cost = PrintCostingAgent.calculateCost({
        ...scenario.specs,
        quantity,
        documentType
      });

      return {
        option: scenario.name,
        specifications: scenario.specs,
        totalCost: cost.totalCost,
        pricePerUnit: cost.costBreakdown.pricePerUnit,
        breakdown: cost.costBreakdown
      };
    });

    // Get expert recommendation
    const expertRec = PrintCostingAgent.getExpertRecommendations(documentType, quantity);

    res.json({
      success: true,
      message: 'Print options compared successfully',
      data: {
        comparisons,
        expertRecommendation: expertRec,
        analysis: this.generateComparisonAnalysis(comparisons)
      }
    });

  } catch (error) {
    console.error('Compare print options error:', error);
    res.status(500).json({
      success: false,
      message: 'Error comparing print options',
      error: error.message
    });
  }
};

// Helper: Generate comparison analysis
exports.generateComparisonAnalysis = function(comparisons) {
  const sorted = [...comparisons].sort((a, b) => a.totalCost - b.totalCost);
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];

  const priceDifference = mostExpensive.totalCost - cheapest.totalCost;
  const percentageDifference = ((priceDifference / cheapest.totalCost) * 100).toFixed(1);

  return {
    cheapestOption: cheapest.option,
    cheapestPrice: cheapest.totalCost,
    mostExpensiveOption: mostExpensive.option,
    mostExpensivePrice: mostExpensive.totalCost,
    priceDifference,
    percentageDifference: `${percentageDifference}%`,
    recommendation: `The ${cheapest.option} costs ${percentageDifference}% less than the ${mostExpensive.option}. ` +
      `Consider your quality requirements and budget when choosing.`,
    valueForMoney: sorted[1]?.option || cheapest.option // Second cheapest is often best value
  };
};

// Helper: Get expert advice
exports.getExpertAdvice = function(costBreakdown) {
  const advice = [];

  // Advice based on quantity
  if (costBreakdown.quantity < 100) {
    advice.push({
      type: 'quantity',
      message: 'Tip: Ordering 100+ copies would qualify you for volume discounts (5-20% off)',
      savings: 'potential'
    });
  }

  // Advice based on discount
  if (costBreakdown.discount.percentage > 0) {
    advice.push({
      type: 'discount',
      message: `Great! You're saving ${costBreakdown.discount.percentage}% with volume pricing`,
      savings: 'applied'
    });
  }

  // Advice on paper type
  if (costBreakdown.components.paper.description.includes('photo_paper')) {
    advice.push({
      type: 'paper',
      message: 'Photo paper provides exceptional quality but is premium-priced. Consider glossy paper for a balance of quality and cost.',
      alternative: 'glossy_130gsm'
    });
  }

  // Advice on printing
  if (costBreakdown.printType === 'full_color_photo') {
    advice.push({
      type: 'printing',
      message: 'Full-color photo printing provides the highest quality. Standard color printing may be sufficient for most documents.',
      alternative: 'color'
    });
  }

  // Advice on urgency
  if (costBreakdown.urgency.type !== 'standard') {
    advice.push({
      type: 'urgency',
      message: `${costBreakdown.urgency.type} printing adds ${(costBreakdown.urgency.multiplier * 100).toFixed(0)}% to the cost. Standard delivery can save you money.`,
      savings: costBreakdown.urgency.cost
    });
  }

  // General advice
  advice.push({
    type: 'general',
    message: 'Print experts recommend ordering samples first for large orders to ensure quality meets expectations.',
    tip: 'quality_assurance'
  });

  return advice;
};

// Get cost optimization suggestions
exports.getCostOptimization = async (req, res) => {
  try {
    const {
      documentType,
      quantity,
      currentSpecs
    } = req.body;

    if (!documentType || !quantity || !currentSpecs) {
      return res.status(400).json({
        success: false,
        message: 'Document type, quantity, and current specs are required'
      });
    }

    // Calculate current cost
    const currentCost = PrintCostingAgent.calculateCost({
      ...currentSpecs,
      quantity,
      documentType
    });

    // Generate optimization suggestions
    const optimizations = [];

    // Suggestion 1: Reduce paper quality if using premium
    if (currentSpecs.paperType !== 'standard_80gsm') {
      const optimizedSpecs1 = { ...currentSpecs, paperType: 'standard_80gsm' };
      const optimizedCost1 = PrintCostingAgent.calculateCost({
        ...optimizedSpecs1,
        quantity,
        documentType
      });
      optimizations.push({
        suggestion: 'Use standard paper instead of premium',
        change: { paperType: 'standard_80gsm' },
        savings: parseFloat((currentCost.totalCost - optimizedCost1.totalCost).toFixed(2)),
        savingsPercentage: (((currentCost.totalCost - optimizedCost1.totalCost) / currentCost.totalCost) * 100).toFixed(1),
        newTotal: optimizedCost1.totalCost
      });
    }

    // Suggestion 2: Use double-sided printing
    if (currentSpecs.sides === 'single') {
      const optimizedSpecs2 = { ...currentSpecs, sides: 'double' };
      const optimizedCost2 = PrintCostingAgent.calculateCost({
        ...optimizedSpecs2,
        quantity,
        documentType
      });
      optimizations.push({
        suggestion: 'Use double-sided printing to reduce paper cost',
        change: { sides: 'double' },
        savings: parseFloat((currentCost.totalCost - optimizedCost2.totalCost).toFixed(2)),
        savingsPercentage: (((currentCost.totalCost - optimizedCost2.totalCost) / currentCost.totalCost) * 100).toFixed(1),
        newTotal: optimizedCost2.totalCost
      });
    }

    // Suggestion 3: Remove lamination if present
    if (currentSpecs.lamination !== 'none') {
      const optimizedSpecs3 = { ...currentSpecs, lamination: 'none' };
      const optimizedCost3 = PrintCostingAgent.calculateCost({
        ...optimizedSpecs3,
        quantity,
        documentType
      });
      optimizations.push({
        suggestion: 'Remove lamination for cost savings',
        change: { lamination: 'none' },
        savings: parseFloat((currentCost.totalCost - optimizedCost3.totalCost).toFixed(2)),
        savingsPercentage: (((currentCost.totalCost - optimizedCost3.totalCost) / currentCost.totalCost) * 100).toFixed(1),
        newTotal: optimizedCost3.totalCost
      });
    }

    // Suggestion 4: Use standard delivery
    if (currentSpecs.urgency !== 'standard') {
      const optimizedSpecs4 = { ...currentSpecs, urgency: 'standard' };
      const optimizedCost4 = PrintCostingAgent.calculateCost({
        ...optimizedSpecs4,
        quantity,
        documentType
      });
      optimizations.push({
        suggestion: 'Choose standard delivery instead of express',
        change: { urgency: 'standard' },
        savings: parseFloat((currentCost.totalCost - optimizedCost4.totalCost).toFixed(2)),
        savingsPercentage: (((currentCost.totalCost - optimizedCost4.totalCost) / currentCost.totalCost) * 100).toFixed(1),
        newTotal: optimizedCost4.totalCost
      });
    }

    // Suggestion 5: Increase quantity for volume discount
    const nextDiscountTier = this.getNextDiscountTier(quantity);
    if (nextDiscountTier) {
      const optimizedCost5 = PrintCostingAgent.calculateCost({
        ...currentSpecs,
        quantity: nextDiscountTier.quantity,
        documentType
      });
      const currentPricePerUnit = currentCost.costBreakdown.pricePerUnit;
      const newPricePerUnit = optimizedCost5.costBreakdown.pricePerUnit;

      optimizations.push({
        suggestion: `Increase order to ${nextDiscountTier.quantity} units for ${nextDiscountTier.discount}% volume discount`,
        change: { quantity: nextDiscountTier.quantity },
        savings: parseFloat((currentPricePerUnit - newPricePerUnit).toFixed(2)),
        savingsPercentage: nextDiscountTier.discount,
        newTotal: optimizedCost5.totalCost,
        pricePerUnit: newPricePerUnit,
        note: `You'll pay more total, but save ${((currentPricePerUnit - newPricePerUnit) / currentPricePerUnit * 100).toFixed(1)}% per unit`
      });
    }

    // Sort by savings
    optimizations.sort((a, b) => b.savings - a.savings);

    res.json({
      success: true,
      message: 'Cost optimization suggestions generated',
      data: {
        currentCost: currentCost.totalCost,
        currentBreakdown: currentCost.costBreakdown,
        optimizations,
        potentialTotalSavings: optimizations.reduce((sum, opt) => sum + (opt.savings || 0), 0)
      }
    });

  } catch (error) {
    console.error('Get cost optimization error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating optimization suggestions',
      error: error.message
    });
  }
};

// Helper: Get next discount tier
exports.getNextDiscountTier = function(currentQuantity) {
  const tiers = [
    { quantity: 100, discount: 5 },
    { quantity: 250, discount: 10 },
    { quantity: 500, discount: 15 },
    { quantity: 1000, discount: 20 }
  ];

  return tiers.find(tier => tier.quantity > currentQuantity);
};

// Get printing statistics
exports.getPrintingStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalQuotes = await PrintCostingAgent.count({ where: { userId } });
    const completedOrders = await PrintCostingAgent.count({
      where: { userId, status: 'completed' }
    });

    const quotes = await PrintCostingAgent.findAll({ where: { userId } });

    const totalSpent = quotes.reduce((sum, quote) => sum + parseFloat(quote.totalCost), 0);
    const totalSaved = quotes.reduce((sum, quote) => sum + parseFloat(quote.discountAmount), 0);

    // Most used document type
    const documentTypeCounts = {};
    quotes.forEach(quote => {
      documentTypeCounts[quote.documentType] = (documentTypeCounts[quote.documentType] || 0) + 1;
    });
    const mostUsedDocType = Object.keys(documentTypeCounts).reduce((a, b) =>
      documentTypeCounts[a] > documentTypeCounts[b] ? a : b,
      'none'
    );

    res.json({
      success: true,
      data: {
        totalQuotes,
        completedOrders,
        totalSpent: parseFloat(totalSpent.toFixed(2)),
        totalSaved: parseFloat(totalSaved.toFixed(2)),
        averageOrderValue: totalQuotes > 0 ? parseFloat((totalSpent / totalQuotes).toFixed(2)) : 0,
        mostUsedDocumentType: mostUsedDocType,
        documentTypeBreakdown: documentTypeCounts
      }
    });

  } catch (error) {
    console.error('Get printing stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching printing statistics',
      error: error.message
    });
  }
};

module.exports = exports;
