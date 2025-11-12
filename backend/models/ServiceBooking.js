module.exports = (sequelize, DataTypes) => {
  const ServiceBooking = sequelize.define('ServiceBooking', {
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
    service_type: {
      type: DataTypes.ENUM('survey', 'legal', 'construction', 'finance'),
      allowNull: false
    },
    service_sub_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    details: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    booking_status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    assigned_to: {
      type: DataTypes.UUID,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'service_bookings',
    timestamps: true,
    underscored: true
  });

  return ServiceBooking;
};
