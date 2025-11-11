const express = require('express');
const router = express.Router();
const { getOverview, getLowStock, getSalesDaily } = require('../controllers/reportController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// All report routes require authentication and artisan/admin role
router.get('/overview', authenticate, authorizeRoles('artisan', 'admin'), getOverview);
router.get('/low-stock', authenticate, authorizeRoles('artisan', 'admin'), getLowStock);
router.get('/sales-daily', authenticate, authorizeRoles('artisan', 'admin'), getSalesDaily);

module.exports = router;

