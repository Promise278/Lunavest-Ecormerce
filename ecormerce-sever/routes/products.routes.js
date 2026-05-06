const express = require("express")
const { generate_products, seeAllProducts, deleteProducts } = require("../controllers/products.controller")
const { toggleLike, getLikedProducts } = require("../controllers/likes.controller")
const { authMiddleware } = require("../middleware/auth.middleware")
const { adminMiddleware } = require("../middleware/admin.middleware")
const upload = require("../middleware/upload.middleware")
const router = express.Router()

router.post("/generate_products", upload.single("image"), authMiddleware, adminMiddleware, generate_products)
router.get("/seeAllproducts", seeAllProducts)
router.delete("/deleteProducts/:id", authMiddleware, adminMiddleware, deleteProducts)

router.post("/like/:id", authMiddleware, toggleLike)
router.get("/liked", authMiddleware, getLikedProducts)

module.exports = router