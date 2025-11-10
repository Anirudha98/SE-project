const sequelize = require('../config/db');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/productModel');
const User = require('../models/User');
const { buildInvoiceStream } = require('../utils/invoice');

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const buildOrderResponse = (order) => ({
  id: order.id,
  total: Number(order.total),
  status: order.status,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  items: order.items
    ? order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: Number(item.price),
        qty: item.qty,
        lineTotal: Number(item.lineTotal),
      }))
    : undefined,
});

const fetchOrderForUser = async (orderId, userId, role) => {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: OrderItem,
        as: 'items',
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      },
    ],
  });

  if (!order) {
    throw httpError(404, 'Order not found');
  }

  if (order.userId !== userId && role !== 'admin') {
    throw httpError(403, 'You do not have access to this order');
  }

  return order;
};

exports.createOrder = async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'At least one item is required' });
  }

  const transaction = await sequelize.transaction();

  try {
    const normalizedItems = new Map();
    items.forEach((item) => {
      const qty = Number(item.qty);
      if (!item.productId || !Number.isInteger(qty) || qty <= 0) {
        throw httpError(400, 'Each item must include productId and qty > 0');
      }
      const currentQty = normalizedItems.get(item.productId) || 0;
      normalizedItems.set(item.productId, currentQty + qty);
    });

    const productIds = Array.from(normalizedItems.keys());
    const products = await Product.findAll({
      where: { id: productIds },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (products.length !== productIds.length) {
      throw httpError(400, 'Some products are unavailable');
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    let total = 0;
    const orderItemsPayload = productIds.map((productId) => {
      const product = productMap.get(productId);
      const qty = normalizedItems.get(productId);

      if (product.stock < qty) {
        throw httpError(400, `Insufficient stock for ${product.name}`);
      }

      const price = Number(product.price);
      const lineTotal = price * qty;
      total += lineTotal;

      product.stock -= qty;

      return {
        productId: product.id,
        name: product.name,
        price: price.toFixed(2),
        qty,
        lineTotal: lineTotal.toFixed(2),
      };
    });

    const order = await Order.create(
      {
        userId: req.user.id,
        total: total.toFixed(2),
        status: 'PLACED',
      },
      { transaction }
    );

    const itemsWithOrderId = orderItemsPayload.map((item) => ({
      ...item,
      orderId: order.id,
    }));

    await OrderItem.bulkCreate(itemsWithOrderId, { transaction });
    await Promise.all(products.map((product) => product.save({ transaction })));

    await transaction.commit();

    res.status(201).json({ orderId: order.id, total: Number(order.total), status: order.status });
  } catch (error) {
    await transaction.rollback();
    const status = error.status || 500;
    console.error('Error creating order:', error);
    res.status(status).json({ message: error.message || 'Could not create order' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [{ model: OrderItem, as: 'items' }],
    });

    res.json({ orders: orders.map(buildOrderResponse) });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Could not fetch orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await fetchOrderForUser(req.params.id, req.user.id, req.user.role);
    res.json({ order: buildOrderResponse(order) });
  } catch (error) {
    const status = error.status || 500;
    console.error('Error fetching order:', error);
    res.status(status).json({ message: error.message || 'Could not fetch order' });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const order = await fetchOrderForUser(req.params.id, req.user.id, req.user.role);
    const invoiceStream = buildInvoiceStream(order, order.user);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${order.id}.pdf`);

    invoiceStream.on('error', (streamError) => {
      console.error('Invoice stream error:', streamError);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Could not generate invoice' });
      } else {
        res.end();
      }
    });

    return invoiceStream.pipe(res);
  } catch (error) {
    const status = error.status || 500;
    console.error('Error generating invoice:', error);
    res.status(status).json({ message: error.message || 'Could not generate invoice' });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { UserId: userId },
      include: OrderItem,
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order history" });
  }
};

