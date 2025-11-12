module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define('Property', {
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
    branch_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'branches',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    property_type: {
      type: DataTypes.ENUM('land', 'dtcp_plot', 'house', 'commercial', 'industrial'),
      allowNull: false
    },
    listing_type: {
      type: DataTypes.ENUM('sale', 'rent'),
      defaultValue: 'sale'
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    area_unit: {
      type: DataTypes.ENUM('sqft', 'sqm', 'acre', 'cent', 'grounds'),
      defaultValue: 'sqft'
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    region: {
      type: DataTypes.ENUM('coimbatore', 'salem', 'tirupur'),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(50),
      defaultValue: 'Tamil Nadu'
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    amenities: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    features: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending', 'pending_super', 'approved', 'rejected', 'sold', 'rented'),
      defaultValue: 'pending'
    },
    sv_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_owner: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    approved_by_branch_admin: {
      type: DataTypes.UUID,
      allowNull: true
    },
    branch_approval_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approved_by_super_admin: {
      type: DataTypes.UUID,
      allowNull: true
    },
    super_approval_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    views_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'properties',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['region', 'location']
      },
      {
        fields: ['property_type']
      },
      {
        fields: ['price']
      },
      {
        fields: ['status']
      },
      {
        fields: ['sv_verified']
      }
    ]
  });

  return Property;
};
