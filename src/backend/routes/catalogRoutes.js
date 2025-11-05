const express = require("express");
const router = express.Router();
const catalogController = require("../controllers/catalogController");

// ✅ GET: /api/catalog — fetch all products
router.get("/", catalogController.getAllProducts);

module.exports = router;