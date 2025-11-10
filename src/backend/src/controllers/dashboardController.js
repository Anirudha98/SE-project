const { Order, OrderItem, Product, User } = require("../models");

exports.getArtisanDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (user.role !== "artisan") {
      return res.status(403).json({ message: "Access denied" });
    }

    const products = await Product.findAll({ where: { artisanName: user.name } });
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalSales = await OrderItem.sum("price");

    res.json({
      artisan: user.name,
      totalProducts: products.length,
      totalStock,
      totalSales,
      products,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard", error: err.message });
  }
};
