const express = require("express")
const { generate_products, seeAllProducts, deleteProducts } = require("../controllers/products.controller")
const { authMiddleware } = require("../middleware/auth.middleware")
const upload = require("../middleware/upload.middleware")
const router = express.Router()
// const multer = require("multer");

router.post("/generate_products", upload.any(), authMiddleware, generate_products)
router.get("/seeAllproducts", authMiddleware, seeAllProducts)
router.delete("/deleteProducts/:id", authMiddleware, deleteProducts)


module.exports = router