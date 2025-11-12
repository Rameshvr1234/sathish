module.exports = (sequelize, DataTypes) => {
  const OfferNews = sequelize.define('OfferNews', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('offer', 'news'),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    link_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    valid_from: {
      type: DataTypes.DATE,
      allowNull: true
    },
    valid_until: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'offers_news',
    timestamps: true,
    underscored: true
  });

  return OfferNews;
};
