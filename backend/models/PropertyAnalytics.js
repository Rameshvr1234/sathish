module.exports = (sequelize, DataTypes) => {
  const PropertyAnalytics = sequelize.define('PropertyAnalytics', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of views on this date'
    },
    unique_viewers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Unique viewers on this date'
    },
    shortlists: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of shortlists on this date'
    },
    contacts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of contact requests on this date'
    },
    shares: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of shares on this date'
    },
    virtual_tour_views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of virtual tour views'
    },
    video_call_requests: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of video call tour requests'
    },
    site_visit_requests: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of site visit requests'
    },
    avg_time_on_page: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Average time spent in seconds'
    },
    bounce_rate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      comment: 'Bounce rate percentage'
    },
    conversion_rate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      comment: 'Conversion rate (contacts/views)'
    },
    traffic_sources: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Traffic source breakdown: {direct: 10, search: 20, social: 5}'
    },
    device_breakdown: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Device breakdown: {mobile: 50, desktop: 30, tablet: 20}'
    },
    location_breakdown: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Viewer location breakdown: {city: count}'
    },
    search_keywords: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Keywords that led to this property'
    }
  }, {
    tableName: 'property_analytics',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['property_id']
      },
      {
        fields: ['date']
      },
      {
        unique: true,
        fields: ['property_id', 'date']
      }
    ]
  });

  return PropertyAnalytics;
};
