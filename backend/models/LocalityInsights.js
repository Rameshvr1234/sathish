const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LocalityInsights = sequelize.define('LocalityInsights', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  locality_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  // Overall Rating
  overall_rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: { min: 0, max: 10 },
    comment: 'Overall score 0-10'
  },

  // Individual Scores (0-10)
  safety_score: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: { min: 0, max: 10 }
  },
  connectivity_score: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: { min: 0, max: 10 }
  },
  lifestyle_score: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: { min: 0, max: 10 }
  },
  environment_score: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: { min: 0, max: 10 }
  },
  growth_potential_score: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: { min: 0, max: 10 }
  },

  // Locality Details
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  demographics: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'family-friendly, working professionals, students'
  },

  // Connectivity
  nearest_metro: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  metro_distance_km: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  bus_routes: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  highways: {
    type: DataTypes.JSONB,
    defaultValue: []
  },

  // Infrastructure
  road_quality: {
    type: DataTypes.ENUM('excellent', 'good', 'average', 'poor'),
    defaultValue: 'average'
  },
  water_supply: {
    type: DataTypes.ENUM('24x7', 'regular', 'irregular', 'scarce'),
    defaultValue: 'regular'
  },
  power_supply: {
    type: DataTypes.ENUM('24x7', 'regular', 'frequent_cuts', 'unreliable'),
    defaultValue: 'regular'
  },

  // Social Infrastructure
  schools_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  hospitals_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  parks_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  malls_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  restaurants_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  // Price Information
  avg_price_per_sqft: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  price_trend_1yr: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Percentage change in last 1 year'
  },
  price_trend_3yr: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Percentage change in last 3 years'
  },

  // Review Stats
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  average_review_rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0
  },

  // Additional Info
  pros: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  cons: {
    type: DataTypes.JSONB,
    defaultValue: []
  },

  // Coordinates for map
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  }
}, {
  tableName: 'locality_insights',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['city', 'locality_name']
    },
    {
      fields: ['overall_rating']
    },
    {
      fields: ['avg_price_per_sqft']
    }
  ]
});

module.exports = LocalityInsights;
