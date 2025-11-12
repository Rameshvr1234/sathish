module.exports = (sequelize, DataTypes) => {
  const Lead = sequelize.define('Lead', {
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
    branch_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'branches',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lead_source: {
      type: DataTypes.ENUM('website', 'phone', 'email', 'walk_in', 'referral'),
      defaultValue: 'website'
    },
    lead_status: {
      type: DataTypes.ENUM('new', 'contacted', 'interested', 'site_visit_scheduled', 'negotiation', 'closed_won', 'closed_lost'),
      defaultValue: 'new'
    },
    follow_up_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'leads',
    timestamps: true,
    underscored: true
  });

  return Lead;
};
