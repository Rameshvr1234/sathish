module.exports = (sequelize, DataTypes) => {
  const Builder = sequelize.define('Builder', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    company_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    established_year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: false
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
    gst_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    total_projects: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ongoing_projects: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    completed_projects: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0,
      comment: 'Average rating'
    },
    review_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    specializations: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of specializations: residential, commercial, luxury, etc.'
    },
    certifications: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of certifications and awards'
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'suspended'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'builders',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['rera_number']
      },
      {
        fields: ['status']
      },
      {
        fields: ['is_verified']
      },
      {
        fields: ['rating']
      }
    ]
  });

  return Builder;
};
