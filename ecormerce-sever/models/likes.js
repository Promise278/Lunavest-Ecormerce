"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    static associate(models) {
      Likes.belongsTo(models.Users, {
        foreignKey: "UserId",
      });
      Likes.belongsTo(models.Products, {
        foreignKey: "ProductId",
      });
    }
  }
  Likes.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      ProductId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Likes",
      tableName: "Like",
    }
  );
  return Likes;
};
