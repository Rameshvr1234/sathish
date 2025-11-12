module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'properties',
        key: 'id'
      }
    },
    builder_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Review for builder'
    },
    agent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Review for agent/seller'
    },
    review_type: {
      type: DataTypes.ENUM('property', 'builder', 'agent', 'locality'),
      allowNull: false
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      validate: {
        min: 0,
        max: 5
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pros: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of positive points'
    },
    cons: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of negative points'
    },
    images: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Review images/photos'
    },
    verified_purchase: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Verified buyer/renter'
    },
    helpful_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of users who found this helpful'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['property_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['rating']
      },
      {
        fields: ['status']
      }
    ]
  });

  return Review;
};
