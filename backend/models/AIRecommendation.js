module.exports = (sequelize, DataTypes) => {
  const AIRecommendation = sequelize.define('AIRecommendation', {
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
      },
      onDelete: 'CASCADE'
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    score: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false,
      comment: 'Recommendation score (0-1)'
    },
    factors: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Factors contributing to recommendation: {budget_match: 0.9, location_match: 0.8, ...}'
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Human-readable explanation for recommendation'
    },
    model_version: {
      type: DataTypes.STRING(50),
      defaultValue: 'v1.0',
      comment: 'ML model version used'
    },
    context: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'User context at time of recommendation: {search_history, preferences, behavior}'
    },
    shown_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When recommendation was shown to user'
    },
    clicked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    clicked_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    contacted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Did user contact seller?'
    },
    contacted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    shortlisted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    shortlisted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    feedback_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      },
      comment: 'User feedback on recommendation quality'
    },
    is_relevant: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'User marked as relevant/not relevant'
    }
  }, {
    tableName: 'ai_recommendations',
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
        fields: ['score']
      },
      {
        fields: ['shown_at']
      },
      {
        unique: true,
        fields: ['user_id', 'property_id', 'created_at']
      }
    ]
  });

  return AIRecommendation;
};
