const express = require('express');
const router = express.Router();
const {
  listPublic,
  addProduct,
  listMyProducts,
  updateMyProduct,
  updateStock,
  setAvailability,
} = require('../controllers/productController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Public route - list products with filters
router.get('/', listPublic);

// Artisan/Admin routes - require authentication and authorization
router.post('/', authenticate, authorizeRoles('artisan', 'admin'), addProduct);
router.get('/mine', authenticate, authorizeRoles('artisan', 'admin'), listMyProducts);
router.put('/:id', authenticate, authorizeRoles('artisan', 'admin'), updateMyProduct);
router.patch('/:id', authenticate, authorizeRoles('artisan', 'admin'), updateMyProduct);
router.patch('/:id/stock', authenticate, authorizeRoles('artisan', 'admin'), updateStock);
router.patch('/:id/availability', authenticate, authorizeRoles('artisan', 'admin'), setAvailability);

module.exports = router;
