const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const openapiSpec = require("./docs/openapi");
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/products.routes");
const orderRoutes = require("./routes/orders.routes");
const { sequelize } = require("./models");
const path = require("path");

const PORT = process.env.PORT || 5000;
const app = express();
// Render sits in front of us, so honor X-Forwarded-Proto (makes the derived
// docs URL https instead of http).
app.set("trust proxy", 1);

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

// API docs: interactive UI at /api-docs, raw spec at /api-docs.json
// The server URL in the spec is derived from the request, so "Try it out"
// works on localhost and on any deployed host. Set PUBLIC_API_URL to pin it.
function specForRequest(req) {
  const url =
    process.env.PUBLIC_API_URL || `${req.protocol}://${req.get("host")}`;
  return { ...openapiSpec, servers: [{ url, description: "API server" }] };
}

app.get("/api-docs.json", (req, res) => res.json(specForRequest(req)));
app.use(
  "/api-docs",
  swaggerUi.serve,
  (req, res, next) =>
    swaggerUi.setup(specForRequest(req), {
      customSiteTitle: "LunaVest API Docs",
      explorer: true,
    })(req, res, next)
);

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
