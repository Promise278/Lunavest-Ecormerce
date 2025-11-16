const express = require('express')
const PORT = 5000;
const app = express();
const authRoutes = require("./routes/auth.route")
const tickRouthes =require("./routes/products.routes");
const connection = require('./config/connection');

app.use(express.json())

app.get('/',(req, res) => {
    console.log("Welcome to the page")
    res.send("Welcome to your homepage")
})


app.use('/auth', authRoutes)
app.use('/products', tickRouthes)

connection.sync().then(async() => {
    app.listen(PORT, () => {
        console.log(`Database Connected Successfully and Server running on port ${PORT}`)
    })
}).catch((e) => {
    console.log(e)
});
// const express = require('express');
// const PORT = 5000;
// const app = express();
// const authRoutes = require("./routes/auth.route");
// const tickRouthes = require("./routes/products.routes");
// const connection = require('./config/connection'); // Sequelize instance

// // IMPORTANT STEP: Import ALL your models here so Sequelize is aware of them
// // before connection.sync() is called.
// const {User} = require('./models'); // <- ADD THIS (or the correct path to your User model)
// // If you have a Product model, you would add it like this:
// // const Product = require('./models/Product'); 
// // (Make sure to import all models you want to be synced)

// app.use(express.json());

// app.get('/', (req, res) => {
//     console.log("Welcome to the page");
//     res.send("Welcome to your homepage");
// });

// app.use('/auth', authRoutes);
// app.use('/products', tickRouthes);

// // Use connection.sync() to create tables based on the models you imported.
// //
// // === Important Notes on connection.sync() ===
// // 1. connection.sync(): Creates tables if they don't exist. Leaves existing tables and data alone. (SAFE)
// // 2. connection.sync({ force: true }): DANGER! This DROPS ALL existing tables and recreates them. (Use ONLY for development/testing)
// // 3. connection.sync({ alter: true }): Checks the current table structure and makes necessary modifications (e.g., adding columns) to match the model.

// connection.sync()
//     .then(async () => {
//         // Once tables are synced/created, start the server
//         app.listen(PORT, () => {
//             console.log(`Database Connected Successfully and Server running on port ${PORT}`);
//         });
//     })
//     .catch((e) => {
//         console.log("Failed to connect or sync database schema:", e);
//         // It's a good practice to stop the server if the database fails to connect
//         process.exit(1); 
//     });