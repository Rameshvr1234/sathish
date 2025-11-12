module.exports = (sequelize, DataTypes) => {
  const PropertyImage = sequelize.define('PropertyImage', {
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
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    image_key: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'property_images',
    timestamps: true,
    underscored: true
  });

  return PropertyImage;
};
