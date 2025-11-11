const User = require('./User');
const Product = require('./productModel');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

let associationsApplied = false;

const applyAssociations = () => {
  if (associationsApplied) {
    return;
  }

  Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

  OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
  Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });

  // Artisan-Product associations
  Product.belongsTo(User, { foreignKey: 'artisanId', as: 'artisan' });
  User.hasMany(Product, { foreignKey: 'artisanId', as: 'products' });

  associationsApplied = true;
};

module.exports = applyAssociations;
