module.exports = (sequelize, DataTypes) => {
  const HomeLoanApplication = sequelize.define('HomeLoanApplication', {
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
    property_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'properties',
        key: 'id'
      }
    },
    application_number: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    loan_type: {
      type: DataTypes.ENUM('home_loan', 'loan_against_property', 'balance_transfer', 'top_up'),
      defaultValue: 'home_loan'
    },
    loan_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    property_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    down_payment: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    interest_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: 'Annual interest rate percentage'
    },
    tenure_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Loan tenure in months'
    },
    emi_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Monthly EMI amount'
    },
    applicant_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    applicant_email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    applicant_phone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    applicant_pan: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    applicant_aadhar: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    employment_type: {
      type: DataTypes.ENUM('salaried', 'self_employed', 'business', 'professional'),
      allowNull: false
    },
    monthly_income: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    company_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    work_experience_years: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    existing_loans: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of existing loans: [{type, emi, outstanding}]'
    },
    total_existing_emi: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    credit_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'CIBIL/Credit score'
    },
    co_applicants: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of co-applicants with their details'
    },
    documents: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of uploaded documents: [{type, url, verified}]'
    },
    status: {
      type: DataTypes.ENUM(
        'draft',
        'submitted',
        'under_review',
        'documents_required',
        'approved',
        'rejected',
        'disbursed',
        'cancelled'
      ),
      defaultValue: 'draft'
    },
    eligibility_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Calculated eligibility amount'
    },
    approved_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    approved_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    approved_tenure: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    processing_fee: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    insurance_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    insurance_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bank_remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    disbursed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejected_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'home_loan_applications',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['property_id']
      },
      {
        fields: ['application_number']
      },
      {
        fields: ['status']
      },
      {
        fields: ['bank_name']
      }
    ]
  });

  return HomeLoanApplication;
};
