module.exports = (sequelize, DataTypes) => {
  const LegalBooking = sequelize.define('LegalBooking', {
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
    legal_type: {
      type: DataTypes.ENUM('sale_deed', 'gift_deed', 'legal_advice', 'documentation'),
      allowNull: false
    },
    property_details: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    documents_uploaded: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    lawyer_assigned: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    consultation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    legal_status: {
      type: DataTypes.ENUM('pending', 'review', 'documentation', 'completed'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'legal_bookings',
    timestamps: true,
    underscored: true
  });

  return LegalBooking;
};
