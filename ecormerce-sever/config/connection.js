// const { Sequelize } = require('sequelize')

// const connection = new Sequelize('orm_practice', 'promise', 'promotex', {
//     host: "localhost",
//     dialect: "mysql"
// });

// module.exports = connection;

require("dotenv").config();

const { Sequelize } = require("sequelize");

const connection = new Sequelize(
  process.env.database,
  process.env.username,
  process.env.password,
  {
    host: process.env.host,
    dialect: "mysql",
  }
);

module.exports = connection;