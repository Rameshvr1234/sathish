const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shortlist = sequelize.define('Shortlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'properties',
      key: 'id'
    }
  },
  tags: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Custom tags like "For Parents", "Investment", "Urgent"'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Personal notes about the property'
  },
  folder: {
    type: DataTypes.STRING(100),
    defaultValue: 'default',
    comment: 'Organize shortlisted properties in folders'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  }
}, {
  tableName: 'shortlist',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id', 'property_id'],
      unique: true
    },
    {
      fields: ['user_id', 'folder']
    },
    {
      fields: ['user_id', 'priority']
    }
  ]
});

module.exports = Shortlist;
