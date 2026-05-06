"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    static associate(models) {
      Orders.belongsTo(models.Users, {
        foreignKey: "UserId",
      });
      Orders.hasMany(models.OrderItems, {
        foreignKey: "OrderId",
      });
    }
  }
  Orders.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "paid", "shipped", "delivered", "cancelled"),
        defaultValue: "pending",
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Orders",
      tableName: "Order",
    }
  );
  return Orders;
};
