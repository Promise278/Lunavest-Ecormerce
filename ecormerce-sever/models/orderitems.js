"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItems extends Model {
    static associate(models) {
      OrderItems.belongsTo(models.Orders, {
        foreignKey: "OrderId",
      });
      OrderItems.belongsTo(models.Products, {
        foreignKey: "ProductId",
      });
    }
  }
  OrderItems.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      OrderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      ProductId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "OrderItems",
      tableName: "OrderItem",
    }
  );
  return OrderItems;
};
