const express = require("express");
const { getArtisanDashboard } = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.get("/artisan", authenticate, getArtisanDashboard);

module.exports = router;
