const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./src/config/db');
const productRoutes = require('./src/routes/productRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => res.send('Welcome to Handcrafted Marketplace API'));

// Product routes
app.use('/api/products', productRoutes);

// Sync DB & start server
sequelize
  .sync({ alter: true })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Error syncing database:', err));
