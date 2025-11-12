module.exports = (sequelize, DataTypes) => {
  const PropertyAlert = sequelize.define('PropertyAlert', {
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
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Alert name/label'
    },
    property_type: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of property types'
    },
    listing_type: {
      type: DataTypes.ENUM('sale', 'rent', 'lease', 'any'),
      defaultValue: 'any'
    },
    min_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    max_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    min_bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    regions: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of regions'
    },
    locations: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of specific locations'
    },
    furnishing_status: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'furnished, semi_furnished, unfurnished'
    },
    amenities: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Required amenities'
    },
    possession_status: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'ready_to_move, under_construction, etc.'
    },
    posted_by: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'owner, builder, agent'
    },
    frequency: {
      type: DataTypes.ENUM('instant', 'daily', 'weekly'),
      defaultValue: 'daily',
      comment: 'Notification frequency'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    email_notifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    push_notifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    last_notified_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    matched_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Total properties matched'
    }
  }, {
    tableName: 'property_alerts',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  return PropertyAlert;
};
