const { DataTypes } = require('sequelize');
const connection = require('../config/connection')

const User = connection.define('Users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // lastLogin: {
    //     type: DataTypes.DATE,
    //     allowNull: true
    // }
})

module.exports = User;
