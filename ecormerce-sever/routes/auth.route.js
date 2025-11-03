const express = require("express")
const { register, login, } = require("../controllers/auth.controllers")
const { authMiddleware } = require("../middleware/auth.middleware")
const router = express.Router()

router.post("/register", register)
router.post("/login", login)

module.exports = router