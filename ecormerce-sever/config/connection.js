const { Sequelize } = require('sequelize')

const connection = new Sequelize('ecommerce_db', 'promise', 'promotex', {
    host: "localhost",
    dialect: "mysql"
});

module.exports = connection;