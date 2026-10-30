const express = require("express");
const {
  generate_products,
  seeAllProducts,
  getProduct,
  updateproducts,
  deleteProducts,
} = require("../controllers/products.controller");
const { toggleLike, getLikedProducts } = require("../controllers/likes.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const { adminMiddleware } = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware");
const router = express.Router();

router.get("/seeAllproducts", seeAllProducts);

router.post(
  "/generate_products",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  generate_products
);

router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateproducts
);

router.delete("/deleteProducts/:id", authMiddleware, adminMiddleware, deleteProducts);

router.post("/like/:id", authMiddleware, toggleLike);
router.get("/liked", authMiddleware, getLikedProducts);

router.get("/:id", getProduct);

module.exports = router;
