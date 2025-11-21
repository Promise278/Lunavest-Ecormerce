'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Products.belongsTo(models.Users, {
        foreignKey: "UserId",
        as: 'User'
      })
    }
  }
  Products.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    stock: DataTypes.INTEGER,
    status: DataTypes.ENUM("available", "inactive", "out-of-stock"),
    image: DataTypes.STRING,
    UserId: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'Products',
    tableName: 'Product',
  });
  return Products;
};