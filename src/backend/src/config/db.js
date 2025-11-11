const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: dbPort,
    dialect: 'mysql',
    logging: false,
  }
);

if (process.env.NODE_ENV !== 'test') {
  sequelize
    .authenticate()
    .then(() => console.log('MySQL connected successfully'))
    .catch((err) => console.error('MySQL connection failed:', err));
}

module.exports = sequelize;
