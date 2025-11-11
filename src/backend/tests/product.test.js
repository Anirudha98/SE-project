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
  findAndCountAll: jest.fn(),
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
      { id: 'prod-1', name: 'Handcrafted Vase', price: 49.99 },
      { id: 'prod-2', name: 'Artisan Necklace', price: 29.99 },
    ];
    Product.findAndCountAll.mockResolvedValue({ rows: mockProducts, count: mockProducts.length });

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body.items).toEqual(mockProducts);
    expect(response.body.total).toBe(mockProducts.length);
    expect(response.body.page).toBe(1);
    expect(Product.findAndCountAll).toHaveBeenCalledTimes(1);
  });

  it('handles fetch errors gracefully', async () => {
    Product.findAndCountAll.mockRejectedValue(new Error('DB error'));

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Could not fetch products');
  });
});

describe('POST /api/products', () => {
  it('requires authentication', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({ name: 'Test Product', price: 25 });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/authorization token missing/i);
  });
});
