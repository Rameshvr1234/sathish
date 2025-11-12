module.exports = (sequelize, DataTypes) => {
  const VirtualTour = sequelize.define('VirtualTour', {
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
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: 'Virtual Tour'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tour_type: {
      type: DataTypes.ENUM('360_image', '360_video', 'matterport', 'custom'),
      defaultValue: '360_image'
    },
    panorama_images: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of 360° panorama image URLs with metadata: [{url, title, hotspots: [{pitch, yaw, type, target}]}]'
    },
    tour_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'External tour URL (Matterport, Kuula, etc.)'
    },
    default_scene: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Index of default starting scene'
    },
    auto_rotate: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Enable auto-rotation'
    },
    show_controls: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Show navigation controls'
    },
    allow_fullscreen: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    views_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of times tour was viewed'
    },
    avg_view_duration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Average viewing duration in seconds'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'virtual_tours',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['property_id']
      },
      {
        fields: ['tour_type']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  return VirtualTour;
};
