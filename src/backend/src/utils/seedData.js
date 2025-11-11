const bcrypt = require('bcryptjs');
const Product = require('../models/productModel');
const User = require('../models/User');

const artisanSeeds = [
  { name: 'Priya Desai', email: 'priya.desai@kalakrithi.in', password: 'Artisan@123' },
  { name: 'Sachin Patel', email: 'sachin.patel@kalakrithi.in', password: 'Artisan@123' },
  { name: 'Ramesh Kumar', email: 'ramesh.kumar@kalakrithi.in', password: 'Artisan@123' },
  { name: 'Anita Sharma', email: 'anita.sharma@kalakrithi.in', password: 'Artisan@123' },
  { name: 'Vikram Singh', email: 'vikram.singh@kalakrithi.in', password: 'Artisan@123' },
  { name: 'Meera Joshi', email: 'meera.joshi@kalakrithi.in', password: 'Artisan@123' },
  { name: 'Lakshmi Reddy', email: 'lakshmi.reddy@kalakrithi.in', password: 'Artisan@123' },
  { name: 'Kavita Nair', email: 'kavita.nair@kalakrithi.in', password: 'Artisan@123' },
];

const productSeeds = [
  {
    name: 'Handwoven Ceramic Bowl',
    description:
      'Beautiful oceanic-toned ceramic bowl with natural glazes. Perfect for serving or as a decorative centerpiece.',
    price: 45.0,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500',
    artisanEmail: 'priya.desai@kalakrithi.in',
    artisanName: 'Priya Desai',
  },
  {
    name: 'Sterling Silver Pendant',
    description:
      'Elegant handcrafted sterling silver pendant with intricate latticework and oxidized detailing.',
    price: 89.0,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
    artisanEmail: 'sachin.patel@kalakrithi.in',
    artisanName: 'Sachin Patel',
  },
  {
    name: 'Wooden Serving Tray',
    description:
      'Hand-carved teak wood serving tray with elegant brass handles. Perfect for entertaining guests.',
    price: 65.0,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=500',
    artisanEmail: 'ramesh.kumar@kalakrithi.in',
    artisanName: 'Ramesh Kumar',
  },
  {
    name: 'Macrame Wall Hanging',
    description: 'Bohemian-style macrame wall art handcrafted in natural cotton. Adds warmth to any space.',
    price: 38.0,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1602932327237-2f3c2c7a0c3e?w=500',
    artisanEmail: 'anita.sharma@kalakrithi.in',
    artisanName: 'Anita Sharma',
  },
  {
    name: 'Leather Journal',
    description: 'Hand-stitched leather journal with handmade paper. Perfect for writers and artists.',
    price: 52.0,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500',
    artisanEmail: 'vikram.singh@kalakrithi.in',
    artisanName: 'Vikram Singh',
  },
  {
    name: 'Clay Pottery Vase',
    description: 'Rustic handmade vase with earthy terracotta finish. Each piece is unique.',
    price: 42.0,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500',
    artisanEmail: 'meera.joshi@kalakrithi.in',
    artisanName: 'Meera Joshi',
  },
  {
    name: 'Woven Basket Set',
    description: 'Set of 3 handwoven baskets made from natural jute. Great for storage or decoration.',
    price: 55.0,
    stock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500',
    artisanEmail: 'lakshmi.reddy@kalakrithi.in',
    artisanName: 'Lakshmi Reddy',
  },
  {
    name: 'Hand-Painted Silk Scarf',
    description: 'Luxurious silk scarf with hand-painted floral design. Each scarf is one-of-a-kind.',
    price: 78.0,
    stock: 6,
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500',
    artisanEmail: 'kavita.nair@kalakrithi.in',
    artisanName: 'Kavita Nair',
  },
];

const ensureArtisanUser = async (seed) => {
  const existing = await User.findOne({ where: { email: seed.email } });
  if (existing) {
    if (existing.role !== 'artisan') {
      await existing.update({ role: 'artisan' });
    }
    return existing;
  }

  const password_hash = await bcrypt.hash(seed.password, 10);
  return User.create({
    name: seed.name,
    email: seed.email,
    password_hash,
    role: 'artisan',
  });
};

const seedInitialData = async () => {
  const existingProducts = await Product.count();
  if (existingProducts > 0) {
    return false;
  }

  const artisanMap = new Map();
  for (const artisan of artisanSeeds) {
    const user = await ensureArtisanUser(artisan);
    artisanMap.set(artisan.email, user);
  }

  for (const product of productSeeds) {
    const owner = artisanMap.get(product.artisanEmail);
    if (!owner) {
      continue;
    }

    await Product.create({
      name: product.name,
      description: product.description,
      price: product.price.toFixed(2),
      stock: product.stock,
      imageUrl: product.imageUrl,
      artisanName: product.artisanName,
      artisanId: owner.id,
      isAvailable: product.stock > 0,
    });
  }

  console.log(`[seed] Inserted ${productSeeds.length} demo products for quick testing.`);
  return true;
};

module.exports = seedInitialData;
