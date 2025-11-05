const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// POST: /api/products — Add new product
router.post("/", productController.addProduct);

// GET: /api/products — Fetch all products
router.get("/", (req, res) => {
  const products = productController.getProducts();
  res.status(200).json(products);
});

module.exports = router;
