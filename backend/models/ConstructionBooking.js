module.exports = (sequelize, DataTypes) => {
  const ConstructionBooking = sequelize.define('ConstructionBooking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    booking_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'service_bookings',
        key: 'id'
      }
    },
    construction_type: {
      type: DataTypes.ENUM('2d_3d_plan', '3d_elevation', 'plan_approval', 'vastu', 'walkthrough', 'interior', 'construction'),
      allowNull: false
    },
    project_details: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    plans_uploaded: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    architect_assigned: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contractor_assigned: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estimated_completion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    milestones: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    construction_status: {
      type: DataTypes.ENUM('planning', 'design', 'approval', 'construction', 'completed'),
      defaultValue: 'planning'
    }
  }, {
    tableName: 'construction_bookings',
    timestamps: true,
    underscored: true
  });

  return ConstructionBooking;
};
