module.exports = (sequelize, DataTypes) => {
  const SurveyBooking = sequelize.define('SurveyBooking', {
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
    survey_type: {
      type: DataTypes.ENUM('digital', 'land', 'dtcp_plot', 'house', 'commercial', 'industrial'),
      allowNull: false
    },
    property_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    survey_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    surveyor_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    survey_report_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    survey_status: {
      type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'report_ready'),
      defaultValue: 'scheduled'
    }
  }, {
    tableName: 'survey_bookings',
    timestamps: true,
    underscored: true
  });

  return SurveyBooking;
};
