// const { Sequelize } = require('sequelize')

// const connection = new Sequelize('orm_practice', 'promise', 'promotex', {
//     host: "localhost",
//     dialect: "mysql"
// });

// module.exports = connection;

// require("dotenv").config();
// const { Sequelize } = require("sequelize");

// const connection = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "mysql",
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false
//       }
//     }
//   }
// );

// module.exports = connection;

require("dotenv").config();
const { Sequelize } = require("sequelize");

const connection = new Sequelize(process.env.DB_URL, {
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log,
});

module.exports = connection;