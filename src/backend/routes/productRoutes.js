const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// ✅ POST: /api/products — Add new product
router.post("/", productController.addProduct);

module.exports = router;
