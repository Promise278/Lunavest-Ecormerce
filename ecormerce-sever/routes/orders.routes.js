const express = require("express");
const {
  checkout,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orders.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const { adminMiddleware } = require("../middleware/admin.middleware");
const router = express.Router();

router.post("/checkout", authMiddleware, checkout);
router.get("/my-orders", authMiddleware, getMyOrders);

router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

router.get("/:id", authMiddleware, getOrder);
router.patch("/:id/cancel", authMiddleware, cancelOrder);

module.exports = router;
