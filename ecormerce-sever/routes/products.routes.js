const express = require("express")
const { generate_products, seeAllproducts, deleteProducts } = require("../controllers/products.controllers")
const { authMiddleware } = require("../middleware/auth.middleware")
const router = express.Router()

router.post("/generate_products", authMiddleware, generate_products)
router.get("/seeAllproducts", authMiddleware, seeAllproducts)
router.delete("/deleteProducts/:id", authMiddleware, deleteProducts)


module.exports = router