const { DataTypes } = require('sequelize');
const connection = require('../config/connection')
const User = require("./User")

const Products = connection.define('products', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("sold", "available"),
        allowNull: false
    }
},{
  timestamps: false
})

User.hasMany(Products, {
    foreignKey: "userId"
});

Products.belongsTo(User, {
    foreignKey: "userId"
});

module.exports = Products;