"use strict";
const { User } = require("lucide-react");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Users.hasMany(models.Products, {
      //   foreignKey: "ProductId"
      // })
      Users.hasMany(models.Products, {
        foreignKey: "UserId",
      });
    }
  }
  Users.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "User",
    }
  );
  return Users;
};
