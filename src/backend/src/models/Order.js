const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PLACED', 'PAID', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PLACED',
    },
  },
  {
    tableName: 'Orders',
    timestamps: true,
  }
);

module.exports = Order;
