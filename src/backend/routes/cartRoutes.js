const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Add product to cart
router.post("/add", cartController.addToCart);

// Get all cart items
router.get("/", cartController.getCart);

// Checkout
router.post("/checkout", cartController.checkout);

module.exports = router;
