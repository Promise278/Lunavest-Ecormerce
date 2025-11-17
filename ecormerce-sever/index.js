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

connection.sync({ force: false, alter: false }).then(async() => {
    app.listen(PORT, () => {
        console.log(`Database Connected Successfully and Server running on port ${PORT}`)
    })
}).catch((e) => {
    console.log(`Database connection failed ${e}`)
});