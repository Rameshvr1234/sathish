module.exports = (sequelize, DataTypes) => {
  const Approval = sequelize.define('Approval', {
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
    approval_level: {
      type: DataTypes.ENUM('branch', 'super'),
      allowNull: false
    },
    approver_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    approver_role: {
      type: DataTypes.ENUM('branch_admin', 'super_admin'),
      allowNull: false
    },
    decision: {
      type: DataTypes.ENUM('approved', 'rejected'),
      allowNull: false
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sv_verified_assigned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'approvals',
    timestamps: true,
    underscored: true
  });

  return Approval;
};
