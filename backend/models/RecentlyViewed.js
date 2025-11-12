const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecentlyViewed = sequelize.define('RecentlyViewed', {
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
  viewed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'recently_viewed',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id', 'property_id'],
      unique: true
    },
    {
      fields: ['user_id', 'viewed_at']
    }
  ]
});

module.exports = RecentlyViewed;
