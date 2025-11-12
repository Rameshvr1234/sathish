module.exports = (sequelize, DataTypes) => {
  const VideoCallTour = sequelize.define('VideoCallTour', {
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
    agent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'Property owner or assigned agent'
    },
    scheduled_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      comment: 'Expected duration in minutes'
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'),
      defaultValue: 'scheduled'
    },
    meeting_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Video call meeting URL (Agora/WebRTC)'
    },
    channel_name: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Agora channel name or room ID'
    },
    agora_token: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Agora RTC token'
    },
    user_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'User notes/questions for the tour'
    },
    agent_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Agent notes after the tour'
    },
    recording_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Recording URL if enabled'
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ended_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actual_duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Actual call duration in seconds'
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reminder_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reminder_sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancellation_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancelled_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'video_call_tours',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['property_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['agent_id']
      },
      {
        fields: ['scheduled_at']
      },
      {
        fields: ['status']
      }
    ]
  });

  return VideoCallTour;
};
