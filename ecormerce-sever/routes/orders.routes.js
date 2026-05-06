const express = require("express");
const { checkout, getMyOrders } = require("../controllers/orders.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/checkout", authMiddleware, checkout);
router.get("/my-orders", authMiddleware, getMyOrders);

module.exports = router;
