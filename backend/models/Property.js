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
      type: DataTypes.ENUM('apartment', 'independent_house', 'villa', 'plot', 'builder_floor', 'farm_house', 'studio_apartment', 'penthouse', 'office', 'shop', 'showroom', 'warehouse', 'commercial_land', 'industrial_building', 'co_working', 'agricultural_land'),
      allowNull: false
    },
    listing_type: {
      type: DataTypes.ENUM('sale', 'rent', 'lease'),
      defaultValue: 'sale'
    },
    sub_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Residential/Commercial/Agricultural'
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
    balconies: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    furnishing_status: {
      type: DataTypes.ENUM('furnished', 'semi_furnished', 'unfurnished'),
      defaultValue: 'unfurnished'
    },
    carpet_area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Usable area in sqft'
    },
    built_up_area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Carpet + walls'
    },
    super_built_up_area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Built-up + common areas'
    },
    property_age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Age in years'
    },
    parking_type: {
      type: DataTypes.ENUM('covered', 'open', 'both', 'none'),
      defaultValue: 'none'
    },
    parking_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    facing_direction: {
      type: DataTypes.ENUM('north', 'south', 'east', 'west', 'north_east', 'north_west', 'south_east', 'south_west'),
      allowNull: true
    },
    floor_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Floor number (0 for ground floor)'
    },
    total_floors: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Total floors in building'
    },
    transaction_type: {
      type: DataTypes.ENUM('new_property', 'resale'),
      defaultValue: 'resale'
    },
    possession_status: {
      type: DataTypes.ENUM('ready_to_move', 'under_construction', 'new_launch'),
      defaultValue: 'ready_to_move'
    },
    possession_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    available_from: {
      type: DataTypes.DATE,
      allowNull: true
    },
    overlooking: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of overlooking features: garden, pool, park, main_road, etc.'
    },
    posted_by: {
      type: DataTypes.ENUM('owner', 'builder', 'agent'),
      defaultValue: 'owner'
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
    },
    rera_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'RERA registration number'
    },
    rera_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    owner_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    document_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    floor_plan_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL to floor plan image'
    },
    video_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL to property video/virtual tour'
    },
    builder_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Reference to builder for projects'
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Reference to project if part of a project'
    },
    premium_listing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Is this a premium/featured listing'
    },
    premium_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Premium listing expiry date'
    },
    contact_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of times contacted'
    },
    shortlist_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of times shortlisted'
    },
    last_updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last time property details were updated'
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
