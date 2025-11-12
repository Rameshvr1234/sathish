module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
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
    booking_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'service_bookings',
        key: 'id'
      }
    },
    razorpay_order_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    razorpay_payment_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    razorpay_signature: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'INR'
    },
    payment_status: {
      type: DataTypes.ENUM('created', 'attempted', 'paid', 'failed', 'refunded'),
      defaultValue: 'created'
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    refund_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'payments',
    timestamps: true,
    underscored: true
  });

  return Payment;
};
