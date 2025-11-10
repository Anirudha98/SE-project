const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getInvoice,
} = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');
const { placeOrder, getOrders, getOrderHistory } = require("../controllers/orderController");

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/my', authenticate, getMyOrders);
router.get('/:id/invoice', authenticate, getInvoice);
router.get('/:id', authenticate, getOrderById);
router.get("/history", authenticate, getOrderHistory);

module.exports = router;
