const Product = require('../models/productModel');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, artisanName } = req.body;
    const product = await Product.create({ name, description, price, stock, imageUrl, artisanName });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product', error });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q, category } = req.query;
    const where = {};

    if (q) where.name = { [Op.like]: `%${q}%` };
    if (category) where.category = category;

    const products = await Product.findAll({ where });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};
