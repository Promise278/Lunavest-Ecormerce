const express = require("express");
const PORT = 5000;
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/products.routes");
const orderRoutes = require("./routes/orders.routes");
const connection = require("./config/connection");
const path = require("path");

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  console.log("Welcome to the page");
  res.send("Welcome to your homepage");
});

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

connection
  .sync({ force: false, alter: true })
  .then(async () => {
    app.listen(PORT, () => {
      console.log(
        `Database Connected Successfully and Server running on port ${PORT}`,
      );
    });
  })
  .catch((e) => {
    console.log(`Database connection failed ${e}`);
  });
