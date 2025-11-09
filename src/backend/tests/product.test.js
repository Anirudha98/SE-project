process.env.NODE_ENV = 'test';

// Mock all models before server loads to prevent association errors
jest.mock('../src/models/User', () => ({
  hasMany: jest.fn(),
}));

jest.mock('../src/models/Order', () => ({
  belongsTo: jest.fn(),
  hasMany: jest.fn(),
}));

jest.mock('../src/models/OrderItem', () => ({
  belongsTo: jest.fn(),
}));

jest.mock('../src/models/productModel', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  hasMany: jest.fn(),
}));

const request = require('supertest');
const Product = require('../src/models/productModel');
const { app } = require('../server');

describe('GET /api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a list of products', async () => {
    const mockProducts = [
      { id: 1, name: 'Handcrafted Vase', price: 49.99 },
      { id: 2, name: 'Artisan Necklace', price: 29.99 },
    ];
    Product.findAll.mockResolvedValue(mockProducts);

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProducts);
    expect(Product.findAll).toHaveBeenCalledTimes(1);
  });

  it('handles fetch errors gracefully', async () => {
    Product.findAll.mockRejectedValue(new Error('DB error'));

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Server Error');
  });
});

describe('POST /api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a product', async () => {
    const payload = {
      name: 'Handmade Bowl',
      description: 'Clay bowl',
      price: 35.5,
      stock: 5,
      imageUrl: 'http://example.com/bowl.jpg',
      artisanName: 'Asha',
    };
    Product.create.mockResolvedValue({ id: 1, ...payload });

    const response = await request(app).post('/api/products').send(payload);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(payload.name);
    expect(Product.create).toHaveBeenCalledWith(payload);
  });

  it('handles creation errors', async () => {
    Product.create.mockRejectedValue(new Error('Insert failed'));

    const response = await request(app).post('/api/products').send({ name: 'X' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error adding product');
  });
});
