const express = require("express");
const app = express();
const cors = require("cors");
const catalogRoutes = require("./routes/catalogRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// API endpoints
app.use("/api/catalog", catalogRoutes);

// Default server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;