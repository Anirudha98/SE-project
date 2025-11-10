const express = require("express");
const {
  getProducts,
  addProduct,
  searchProducts, 
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct);
router.get("/search", searchProducts);

module.exports = router;
