const { Op } = require('sequelize');
const Product = require('../models/productModel');
const User = require('../models/User');

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

// Public product listing with filters
exports.listPublic = async (req, res) => {
  try {
    const {
      q,
      minPrice,
      maxPrice,
      inStock,
      artisanId,
      page = 1,
      pageSize = 20,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limit = parseInt(pageSize, 10) || 20;
    const offset = (pageNum - 1) * limit;

    const where = {
      isAvailable: true,
    };

    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
      ];
    }

    if (minPrice) {
      where.price = { ...where.price, [Op.gte]: parseFloat(minPrice) };
    }

    if (maxPrice) {
      where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };
    }

    if (inStock === 'true') {
      where.stock = { [Op.gt]: 0 };
    }

    if (artisanId) {
      where.artisanId = artisanId;
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'artisan',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.json({
      items: rows,
      total: count,
      page: pageNum,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error('Error fetching public products:', error);
    res.status(500).json({ message: 'Could not fetch products', error: error.message });
  }
};

// Add product (artisan only)
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, artisanName } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    if (price < 0) {
      return res.status(400).json({ message: 'Price must be non-negative' });
    }

    const stockValue = stock !== undefined ? parseInt(stock, 10) : 0;
    if (stockValue < 0) {
      return res.status(400).json({ message: 'Stock must be non-negative' });
    }

    const artisan = await User.findByPk(req.user.id);
    if (!artisan) {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price).toFixed(2),
      stock: stockValue,
      imageUrl,
      artisanName: artisanName || artisan.name,
      artisanId: req.user.id,
      isAvailable: true,
    });

    const productWithArtisan = await Product.findByPk(product.id, {
      include: [
        {
          model: User,
          as: 'artisan',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(201).json(productWithArtisan);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// List my products (artisan only, admin can filter by artisanId)
exports.listMyProducts = async (req, res) => {
  try {
    const { artisanId, page = 1, pageSize = 20 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limit = parseInt(pageSize, 10) || 20;
    const offset = (pageNum - 1) * limit;

    let targetArtisanId = req.user.id;

    // Admin can filter by artisanId
    if (req.user.role === 'admin' && artisanId) {
      targetArtisanId = artisanId;
    }

    const { count, rows } = await Product.findAndCountAll({
      where: { artisanId: targetArtisanId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'artisan',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.json({
      items: rows,
      total: count,
      page: pageNum,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error('Error fetching my products:', error);
    res.status(500).json({ message: 'Could not fetch products', error: error.message });
  }
};

// Update my product (artisan only, admin can update any)
exports.updateMyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, artisanName } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership (artisan) or admin role
    if (product.artisanId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to update this product' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({ message: 'Price must be non-negative' });
      }
      updateData.price = parseFloat(price).toFixed(2);
    }
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (artisanName !== undefined) updateData.artisanName = artisanName;

    await product.update(updateData);

    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: User,
          as: 'artisan',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Could not update product', error: error.message });
  }
};

// Update stock
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { delta, stock } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership (artisan) or admin role
    if (product.artisanId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to update this product' });
    }

    let newStock = product.stock;

    if (delta !== undefined) {
      const deltaValue = parseInt(delta, 10);
      if (Number.isNaN(deltaValue)) {
        return res.status(400).json({ message: 'Delta must be a valid integer' });
      }
      newStock = product.stock + deltaValue;
      if (newStock < 0) {
        return res.status(400).json({ message: 'Resulting stock cannot be negative' });
      }
    } else if (stock !== undefined) {
      const stockValue = parseInt(stock, 10);
      if (Number.isNaN(stockValue) || stockValue < 0) {
        return res.status(400).json({ message: 'Stock must be a non-negative integer' });
      }
      newStock = stockValue;
    } else {
      return res.status(400).json({ message: 'Either delta or stock must be provided' });
    }

    await product.update({ stock: newStock });

    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: User,
          as: 'artisan',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Could not update stock', error: error.message });
  }
};

// Set availability
exports.setAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ message: 'isAvailable must be a boolean' });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership (artisan) or admin role
    if (product.artisanId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to update this product' });
    }

    await product.update({ isAvailable });

    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: User,
          as: 'artisan',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Could not update availability', error: error.message });
  }
};

// Legacy method for backward compatibility
exports.getProducts = exports.listPublic;
