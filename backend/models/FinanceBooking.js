module.exports = (sequelize, DataTypes) => {
  const FinanceBooking = sequelize.define('FinanceBooking', {
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
    loan_type: {
      type: DataTypes.ENUM('home_loan', 'plot_loan', 'construction_loan'),
      allowNull: false
    },
    loan_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    property_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    tenure_months: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    interest_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    emi_calculated: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    application_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    documents_submitted: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    loan_status: {
      type: DataTypes.ENUM('enquiry', 'applied', 'under_review', 'approved', 'rejected', 'disbursed'),
      defaultValue: 'enquiry'
    }
  }, {
    tableName: 'finance_bookings',
    timestamps: true,
    underscored: true
  });

  return FinanceBooking;
};
