const express = require("express");
const app = express();
const cors = require("cors");
const catalogRoutes = require("./routes/catalogRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// API endpoints
app.use("/api/catalog", catalogRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Default server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;