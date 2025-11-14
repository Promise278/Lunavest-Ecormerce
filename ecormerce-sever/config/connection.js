const { Sequelize } = require('sequelize')

const connection = new Sequelize('orm_practice', 'promise', 'promotex', {
    host: "localhost",
    dialect: "mysql"
});

module.exports = connection;