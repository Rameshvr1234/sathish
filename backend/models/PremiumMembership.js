module.exports = (sequelize, DataTypes) => {
  const PremiumMembership = sequelize.define('PremiumMembership', {
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
    plan_type: {
      type: DataTypes.ENUM('basic', 'pro', 'enterprise'),
      allowNull: false,
      comment: 'Membership tier'
    },
    plan_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    billing_cycle: {
      type: DataTypes.ENUM('monthly', 'quarterly', 'yearly'),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'cancelled', 'suspended'),
      defaultValue: 'active'
    },
    auto_renewal: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    features: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Plan features and limits'
    },
    property_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Maximum properties that can be posted'
    },
    properties_posted: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    featured_listing_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    featured_listings_used: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lead_access: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    analytics_access: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    priority_support: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    zero_brokerage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Direct owner contact feature'
    },
    payment_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Reference to payment'
    },
    razorpay_subscription_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancellation_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'premium_memberships',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['end_date']
      }
    ]
  });

  return PremiumMembership;
};
