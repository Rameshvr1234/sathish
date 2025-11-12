module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    builder_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'builders',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    project_type: {
      type: DataTypes.ENUM('residential', 'commercial', 'mixed_use'),
      allowNull: false
    },
    property_types: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of property types available: apartment, villa, plot, etc.'
    },
    configurations: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Available BHK configurations'
    },
    total_units: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    available_units: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sold_units: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    min_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    max_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    price_per_sqft: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    total_area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Total project area in acres/sqft'
    },
    area_unit: {
      type: DataTypes.ENUM('sqft', 'acre', 'hectare'),
      defaultValue: 'acre'
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    region: {
      type: DataTypes.STRING(50),
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
    rera_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    rera_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    launch_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    possession_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    construction_status: {
      type: DataTypes.ENUM('new_launch', 'under_construction', 'nearing_completion', 'ready_to_move'),
      defaultValue: 'under_construction'
    },
    completion_percentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    towers: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: 'Number of towers/blocks'
    },
    floors_per_tower: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    amenities: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Project amenities'
    },
    images: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Project images/gallery'
    },
    floor_plans: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Floor plan images'
    },
    brochure_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    video_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    virtual_tour_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    payment_plans: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Available payment plans'
    },
    highlights: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Project highlights and USPs'
    },
    nearby_facilities: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Schools, hospitals, transport, etc.'
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0
    },
    review_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'projects',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['builder_id']
      },
      {
        fields: ['region', 'location']
      },
      {
        fields: ['construction_status']
      },
      {
        fields: ['rera_number']
      },
      {
        fields: ['status']
      }
    ]
  });

  return Project;
};
