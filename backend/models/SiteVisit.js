module.exports = (sequelize, DataTypes) => {
  const SiteVisit = sequelize.define('SiteVisit', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    lead_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'leads',
        key: 'id'
      }
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    scheduled_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    scheduled_time: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    visit_status: {
      type: DataTypes.ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'),
      defaultValue: 'scheduled'
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    interest_level: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: true
    },
    next_action: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'site_visits',
    timestamps: true,
    underscored: true
  });

  return SiteVisit;
};
