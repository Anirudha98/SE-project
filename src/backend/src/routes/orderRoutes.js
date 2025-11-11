const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getInvoice,
  listOrdersByArtisan,
  getOrderDetailForArtisan,
} = require('../controllers/orderController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Buyer routes
router.post('/', authenticate, createOrder);
router.get('/my', authenticate, getMyOrders);
router.get('/:id/invoice', authenticate, getInvoice);
router.get('/:id', authenticate, getOrderById);

// Artisan/Admin routes - order analytics
router.get('/by-artisan', authenticate, authorizeRoles('artisan', 'admin'), listOrdersByArtisan);
router.get('/by-artisan/:id', authenticate, authorizeRoles('artisan', 'admin'), getOrderDetailForArtisan);

module.exports = router;
