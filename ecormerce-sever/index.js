const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/products.routes");
const orderRoutes = require("./routes/orders.routes");
const { sequelize } = require("./models");
const path = require("path");

const PORT = process.env.PORT || 5000;
const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : "*";

app.use(express.json());
app.use(cors({ origin: allowedOrigins }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ success: true, message: "LunaVest API is running" });
});

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// `sync()` only creates missing tables; run `npx sequelize-cli db:migrate` for schema changes.
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Database Connected Successfully and Server running on port ${PORT}`
      );
    });
  })
  .catch((e) => {
    console.log(`Database connection failed ${e}`);
  });
