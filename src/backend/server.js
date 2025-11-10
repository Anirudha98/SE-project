const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./src/config/db');
const applyAssociations = require('./src/models/associations');
const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const dashboardRoutes = require("./src/routes/dashboardRoutes");

dotenv.config();
const app = express();
applyAssociations();

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => res.send('Welcome to Handcrafted Marketplace API'));

// Product routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/dashboard", dashboardRoutes);

const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✓ Database synced!');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('Error syncing database:', err);
  }
};

// Only start server if not in test mode and this is the main module
if (require.main === module && process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, startServer };
