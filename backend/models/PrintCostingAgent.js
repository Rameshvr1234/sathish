const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PrintCostingAgent = sequelize.define('PrintCostingAgent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  documentType: {
    type: DataTypes.ENUM(
      'property_brochure',
      'contract_document',
      'marketing_flyer',
      'property_report',
      'legal_document',
      'floor_plan',
      'custom_document'
    ),
    allowNull: false
  },
  paperSize: {
    type: DataTypes.ENUM('A4', 'A3', 'A5', 'Letter', 'Legal', 'Tabloid'),
    defaultValue: 'A4'
  },
  paperType: {
    type: DataTypes.ENUM(
      'standard_80gsm',
      'premium_100gsm',
      'glossy_130gsm',
      'matte_150gsm',
      'cardstock_250gsm',
      'photo_paper'
    ),
    defaultValue: 'standard_80gsm'
  },
  printType: {
    type: DataTypes.ENUM('black_and_white', 'color', 'full_color_photo'),
    defaultValue: 'black_and_white'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  sides: {
    type: DataTypes.ENUM('single', 'double'),
    defaultValue: 'single'
  },
  binding: {
    type: DataTypes.ENUM(
      'none',
      'staple',
      'spiral',
      'perfect_bound',
      'saddle_stitch',
      'hardcover'
    ),
    defaultValue: 'none'
  },
  lamination: {
    type: DataTypes.ENUM('none', 'gloss', 'matte'),
    defaultValue: 'none'
  },
  finishing: {
    type: DataTypes.JSON,
    defaultValue: {
      folding: false,
      punching: false,
      trimming: false,
      embossing: false
    }
  },
  urgency: {
    type: DataTypes.ENUM('standard', 'express', 'same_day'),
    defaultValue: 'standard'
  },
  baseCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paperCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  printingCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  bindingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  finishingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  urgencyCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  totalCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  costBreakdown: {
    type: DataTypes.JSON,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('quoted', 'confirmed', 'in_production', 'completed', 'cancelled'),
    defaultValue: 'quoted'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'print_costing_agents',
  timestamps: true
});

// Print Expert Logic - Static Methods
PrintCostingAgent.calculateCost = function(params) {
  const {
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
  } = params;

  // Base rates per page (in currency units)
  const paperRates = {
    'A4': { 'standard_80gsm': 0.05, 'premium_100gsm': 0.08, 'glossy_130gsm': 0.15, 'matte_150gsm': 0.18, 'cardstock_250gsm': 0.30, 'photo_paper': 0.40 },
    'A3': { 'standard_80gsm': 0.10, 'premium_100gsm': 0.16, 'glossy_130gsm': 0.30, 'matte_150gsm': 0.36, 'cardstock_250gsm': 0.60, 'photo_paper': 0.80 },
    'A5': { 'standard_80gsm': 0.03, 'premium_100gsm': 0.04, 'glossy_130gsm': 0.08, 'matte_150gsm': 0.09, 'cardstock_250gsm': 0.15, 'photo_paper': 0.20 },
    'Letter': { 'standard_80gsm': 0.05, 'premium_100gsm': 0.08, 'glossy_130gsm': 0.15, 'matte_150gsm': 0.18, 'cardstock_250gsm': 0.30, 'photo_paper': 0.40 },
    'Legal': { 'standard_80gsm': 0.07, 'premium_100gsm': 0.11, 'glossy_130gsm': 0.21, 'matte_150gsm': 0.25, 'cardstock_250gsm': 0.42, 'photo_paper': 0.56 },
    'Tabloid': { 'standard_80gsm': 0.12, 'premium_100gsm': 0.19, 'glossy_130gsm': 0.36, 'matte_150gsm': 0.43, 'cardstock_250gsm': 0.72, 'photo_paper': 0.96 }
  };

  // Printing rates per page
  const printingRates = {
    'black_and_white': 0.10,
    'color': 0.50,
    'full_color_photo': 1.20
  };

  // Binding costs
  const bindingCosts = {
    'none': 0,
    'staple': 0.50,
    'spiral': 2.00,
    'perfect_bound': 5.00,
    'saddle_stitch': 3.00,
    'hardcover': 15.00
  };

  // Lamination costs per page
  const laminationCosts = {
    'none': 0,
    'gloss': 0.30,
    'matte': 0.35
  };

  // Finishing costs
  const finishingCosts = {
    folding: 0.20,
    punching: 0.15,
    trimming: 0.10,
    embossing: 2.00
  };

  // Urgency multipliers
  const urgencyMultipliers = {
    'standard': 0,
    'express': 0.50,      // 50% additional
    'same_day': 1.00      // 100% additional
  };

  // Calculate page count
  const pageCount = sides === 'double' ? quantity * 2 : quantity;

  // Calculate paper cost
  const paperCost = parseFloat((paperRates[paperSize][paperType] * pageCount).toFixed(2));

  // Calculate printing cost
  const printingCost = parseFloat((printingRates[printType] * pageCount).toFixed(2));

  // Calculate binding cost (per document)
  const bindingCost = parseFloat(bindingCosts[binding].toFixed(2));

  // Calculate lamination cost
  const laminationCost = parseFloat((laminationCosts[lamination] * pageCount).toFixed(2));

  // Calculate finishing costs
  let finishingCost = 0;
  if (finishing) {
    if (finishing.folding) finishingCost += finishingCosts.folding * quantity;
    if (finishing.punching) finishingCost += finishingCosts.punching * quantity;
    if (finishing.trimming) finishingCost += finishingCosts.trimming * quantity;
    if (finishing.embossing) finishingCost += finishingCosts.embossing * quantity;
  }
  finishingCost = parseFloat(finishingCost.toFixed(2));

  // Calculate base cost
  const baseCost = parseFloat((paperCost + printingCost + bindingCost + laminationCost + finishingCost).toFixed(2));

  // Apply quantity discounts
  let discountPercentage = 0;
  if (quantity >= 1000) {
    discountPercentage = 0.20; // 20% discount for 1000+ copies
  } else if (quantity >= 500) {
    discountPercentage = 0.15; // 15% discount for 500-999 copies
  } else if (quantity >= 250) {
    discountPercentage = 0.10; // 10% discount for 250-499 copies
  } else if (quantity >= 100) {
    discountPercentage = 0.05; // 5% discount for 100-249 copies
  }

  const discountAmount = parseFloat((baseCost * discountPercentage).toFixed(2));
  const costAfterDiscount = parseFloat((baseCost - discountAmount).toFixed(2));

  // Calculate urgency cost
  const urgencyCost = parseFloat((costAfterDiscount * urgencyMultipliers[urgency]).toFixed(2));

  // Calculate total cost
  const totalCost = parseFloat((costAfterDiscount + urgencyCost).toFixed(2));

  // Create detailed cost breakdown
  const costBreakdown = {
    quantity,
    pageCount,
    paperSize,
    paperType,
    printType,
    sides,
    components: {
      paper: {
        cost: paperCost,
        rate: paperRates[paperSize][paperType],
        description: `${paperType.replace('_', ' ')} - ${pageCount} pages`
      },
      printing: {
        cost: printingCost,
        rate: printingRates[printType],
        description: `${printType.replace('_', ' ')} printing - ${pageCount} pages`
      },
      binding: {
        cost: bindingCost,
        type: binding,
        description: `${binding.replace('_', ' ')} binding`
      },
      lamination: {
        cost: laminationCost,
        type: lamination,
        description: lamination !== 'none' ? `${lamination} lamination - ${pageCount} pages` : 'No lamination'
      },
      finishing: {
        cost: finishingCost,
        details: finishing,
        description: this.getFinishingDescription(finishing)
      }
    },
    subtotal: baseCost,
    discount: {
      percentage: discountPercentage * 100,
      amount: discountAmount,
      reason: this.getDiscountReason(quantity)
    },
    costAfterDiscount,
    urgency: {
      type: urgency,
      cost: urgencyCost,
      multiplier: urgencyMultipliers[urgency]
    },
    total: totalCost,
    pricePerUnit: parseFloat((totalCost / quantity).toFixed(2))
  };

  return {
    baseCost,
    paperCost,
    printingCost,
    bindingCost,
    finishingCost: laminationCost + finishingCost,
    urgencyCost,
    discountAmount,
    totalCost,
    costBreakdown
  };
};

PrintCostingAgent.getFinishingDescription = function(finishing) {
  if (!finishing) return 'No additional finishing';

  const applied = [];
  if (finishing.folding) applied.push('folding');
  if (finishing.punching) applied.push('punching');
  if (finishing.trimming) applied.push('trimming');
  if (finishing.embossing) applied.push('embossing');

  return applied.length > 0 ? applied.join(', ') : 'No additional finishing';
};

PrintCostingAgent.getDiscountReason = function(quantity) {
  if (quantity >= 1000) return 'Bulk discount - 1000+ copies (20%)';
  if (quantity >= 500) return 'Volume discount - 500-999 copies (15%)';
  if (quantity >= 250) return 'Volume discount - 250-499 copies (10%)';
  if (quantity >= 100) return 'Volume discount - 100-249 copies (5%)';
  return 'No volume discount applied';
};

// Expert recommendations
PrintCostingAgent.getExpertRecommendations = function(documentType, quantity) {
  const recommendations = {
    property_brochure: {
      paperSize: 'A4',
      paperType: quantity > 100 ? 'glossy_130gsm' : 'premium_100gsm',
      printType: 'full_color_photo',
      sides: 'double',
      binding: quantity > 50 ? 'saddle_stitch' : 'staple',
      lamination: 'gloss',
      reasoning: 'High-quality glossy paper with full-color printing creates professional property brochures that showcase properties effectively.'
    },
    contract_document: {
      paperSize: 'A4',
      paperType: 'premium_100gsm',
      printType: 'black_and_white',
      sides: 'double',
      binding: 'spiral',
      lamination: 'none',
      reasoning: 'Premium paper with spiral binding ensures durability and easy reference for legal contracts.'
    },
    marketing_flyer: {
      paperSize: 'A5',
      paperType: 'glossy_130gsm',
      printType: 'color',
      sides: 'single',
      binding: 'none',
      lamination: 'gloss',
      reasoning: 'Glossy A5 flyers are cost-effective for mass distribution while maintaining visual appeal.'
    },
    property_report: {
      paperSize: 'A4',
      paperType: 'premium_100gsm',
      printType: 'color',
      sides: 'double',
      binding: 'perfect_bound',
      lamination: 'none',
      reasoning: 'Professional binding and quality paper present comprehensive property reports effectively.'
    },
    legal_document: {
      paperSize: 'Legal',
      paperType: 'premium_100gsm',
      printType: 'black_and_white',
      sides: 'double',
      binding: 'spiral',
      lamination: 'none',
      reasoning: 'Legal size with premium paper ensures all content fits properly and maintains professional standards.'
    },
    floor_plan: {
      paperSize: 'A3',
      paperType: 'premium_100gsm',
      printType: 'color',
      sides: 'single',
      binding: 'none',
      lamination: 'matte',
      reasoning: 'Large format with matte lamination provides clear, detailed floor plans without glare.'
    }
  };

  return recommendations[documentType] || recommendations.property_brochure;
};

module.exports = PrintCostingAgent;
