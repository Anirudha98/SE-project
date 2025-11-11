const { Op, Sequelize } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/productModel');
const User = require('../models/User');

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

// Parse and validate date range
const parseDateRange = (start, end) => {
  const defaultEnd = new Date();
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() - 30);

  const startDate = start ? new Date(start) : defaultStart;
  const endDate = end ? new Date(end) : defaultEnd;

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw httpError(400, 'Invalid date format. Use YYYY-MM-DD');
  }

  if (startDate > endDate) {
    throw httpError(400, 'Start date must be before end date');
  }

  // Set to start/end of day
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};

// Get overview statistics
exports.getOverview = async (req, res) => {
  try {
    const { start, end, artisanId } = req.query;
    const { startDate, endDate } = parseDateRange(start, end);

    let targetArtisanId = req.user.id;

    // Admin can filter by artisanId
    if (req.user.role === 'admin' && artisanId) {
      targetArtisanId = artisanId;
    } else if (req.user.role !== 'admin' && artisanId) {
      return res.status(403).json({ message: 'Only admin can filter by artisanId' });
    }

    // Get orders with items that belong to this artisan
    const orders = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        status: {
          [Op.in]: ['PLACED', 'PAID'],
        },
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              where: { artisanId: targetArtisanId },
              attributes: [],
            },
          ],
        },
      ],
    });

    let revenueTotal = 0;
    let unitsSold = 0;
    const ordersSet = new Set();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = item.product;
        if (product && product.artisanId === targetArtisanId) {
          revenueTotal += Number(item.lineTotal) || 0;
          unitsSold += item.qty || 0;
          ordersSet.add(order.id);
        }
      });
    });

    const ordersCount = ordersSet.size;
    const avgOrderValue = ordersCount > 0 ? revenueTotal / ordersCount : 0;

    res.json({
      revenueTotal: parseFloat(revenueTotal.toFixed(2)),
      ordersCount,
      unitsSold,
      avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    const status = error.status || 500;
    console.error('Error fetching overview:', error);
    res.status(status).json({ message: error.message || 'Could not fetch overview', error: error.message });
  }
};

// Get low stock products
exports.getLowStock = async (req, res) => {
  try {
    const { threshold = 5, artisanId } = req.query;
    const thresholdValue = parseInt(threshold, 10) || 5;

    let targetArtisanId = req.user.id;

    // Admin can filter by artisanId
    if (req.user.role === 'admin' && artisanId) {
      targetArtisanId = artisanId;
    } else if (req.user.role !== 'admin' && artisanId) {
      return res.status(403).json({ message: 'Only admin can filter by artisanId' });
    }

    const products = await Product.findAll({
      where: {
        artisanId: targetArtisanId,
        isAvailable: true,
        stock: {
          [Op.lte]: thresholdValue,
        },
      },
      attributes: ['id', 'name', 'stock'],
      order: [['stock', 'ASC']],
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching low stock:', error);
    res.status(500).json({ message: 'Could not fetch low stock products', error: error.message });
  }
};

// Get daily sales
exports.getSalesDaily = async (req, res) => {
  try {
    const { start, end, artisanId } = req.query;
    const { startDate, endDate } = parseDateRange(start, end);

    let targetArtisanId = req.user.id;

    // Admin can filter by artisanId
    if (req.user.role === 'admin' && artisanId) {
      targetArtisanId = artisanId;
    } else if (req.user.role !== 'admin' && artisanId) {
      return res.status(403).json({ message: 'Only admin can filter by artisanId' });
    }

    // Get orders with items in date range
    const orders = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        status: {
          [Op.in]: ['PLACED', 'PAID'],
        },
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              where: { artisanId: targetArtisanId },
              attributes: [],
            },
          ],
        },
      ],
      attributes: ['id', 'createdAt'],
    });

    // Group by date
    const dailyMap = new Map();

    orders.forEach((order) => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (!dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, {
          date: dateStr,
          revenue: 0,
          orders: new Set(),
          units: 0,
        });
      }

      const daily = dailyMap.get(dateStr);
      order.items.forEach((item) => {
        const product = item.product;
        if (product && product.artisanId === targetArtisanId) {
          daily.revenue += Number(item.lineTotal) || 0;
          daily.units += item.qty || 0;
          daily.orders.add(order.id);
        }
      });
    });

    // Convert to array and format
    const dailySales = Array.from(dailyMap.values())
      .map((daily) => ({
        date: daily.date,
        revenue: parseFloat(daily.revenue.toFixed(2)),
        orders: daily.orders.size,
        units: daily.units,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json(dailySales);
  } catch (error) {
    const status = error.status || 500;
    console.error('Error fetching daily sales:', error);
    res.status(status).json({ message: error.message || 'Could not fetch daily sales', error: error.message });
  }
};

