process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

const jwt = require('jsonwebtoken');
const request = require('supertest');

// Mock models
jest.mock('../src/models/User', () => {
  const mockUser = {
    findByPk: jest.fn(),
    hasMany: jest.fn(),
  };
  return mockUser;
});

jest.mock('../src/models/Order', () => ({
  belongsTo: jest.fn(),
  hasMany: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
}));

jest.mock('../src/models/OrderItem', () => ({
  belongsTo: jest.fn(),
  bulkCreate: jest.fn(),
}));

jest.mock('../src/models/productModel', () => ({
  findAll: jest.fn(),
  findAndCountAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  hasMany: jest.fn(),
  belongsTo: jest.fn(),
}));

jest.mock('../src/models/associations', () => jest.fn());

const { app } = require('../server');
const Product = require('../src/models/productModel');
const User = require('../src/models/User');

// Helper to generate JWT token
const generateToken = (userId, role = 'artisan') => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

describe('Artisan Product Endpoints', () => {
  const artisanId = '11111111-1111-1111-1111-111111111111';
  const adminId = '22222222-2222-2222-2222-222222222222';
  const productId = '33333333-3333-3333-3333-333333333333';
  const artisanToken = generateToken(artisanId, 'artisan');
  const adminToken = generateToken(adminId, 'admin');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/products', () => {
    it('allows artisan to create a product', async () => {
      const mockUser = { id: artisanId, name: 'Test Artisan', email: 'artisan@test.com' };
      const mockProduct = {
        id: productId,
        name: 'Test Product',
        description: 'Test Description',
        price: '29.99',
        stock: 10,
        artisanId: artisanId,
        isAvailable: true,
      };

      User.findByPk.mockResolvedValue(mockUser);
      Product.create.mockResolvedValue(mockProduct);
      Product.findByPk.mockResolvedValue(mockProduct);

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({
          name: 'Test Product',
          description: 'Test Description',
          price: 29.99,
          stock: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test Product');
      expect(Product.create).toHaveBeenCalled();
    });

    it('rejects unauthorized requests', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          price: 29.99,
        });

      expect(response.status).toBe(401);
    });

    it('rejects buyer role', async () => {
      const buyerToken = generateToken('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'buyer');
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          name: 'Test Product',
          price: 29.99,
        });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/products/mine', () => {
    it('returns artisan products', async () => {
      const mockProducts = {
        count: 2,
        rows: [
          { id: 'prod-1', name: 'Product 1', artisanId: artisanId },
          { id: 'prod-2', name: 'Product 2', artisanId: artisanId },
        ],
      };

      Product.findAndCountAll.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/products/mine')
        .set('Authorization', `Bearer ${artisanToken}`);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(2);
      expect(response.body.total).toBe(2);
    });
  });

  describe('PATCH /api/products/:id/stock', () => {
    it('updates stock with delta', async () => {
      const mockProduct = {
        id: productId,
        name: 'Test Product',
        stock: 10,
        artisanId: artisanId,
        update: jest.fn().mockResolvedValue(true),
      };

      Product.findByPk.mockResolvedValue(mockProduct);
      Product.findByPk.mockResolvedValueOnce(mockProduct).mockResolvedValueOnce({
        ...mockProduct,
        stock: 15,
      });

      const response = await request(app)
        .patch(`/api/products/${productId}/stock`)
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({ delta: 5 });

      expect(response.status).toBe(200);
      expect(mockProduct.update).toHaveBeenCalledWith({ stock: 15 });
    });

    it('prevents updating other artisan products', async () => {
      const mockProduct = {
        id: productId,
        name: 'Test Product',
        stock: 10,
        artisanId: adminId, // Different artisan
      };

      Product.findByPk.mockResolvedValue(mockProduct);

      const response = await request(app)
        .patch(`/api/products/${productId}/stock`)
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({ delta: 5 });

      expect(response.status).toBe(403);
    });
  });

  describe('PATCH /api/products/:id/availability', () => {
    it('toggles product availability', async () => {
      const mockProduct = {
        id: productId,
        name: 'Test Product',
        isAvailable: true,
        artisanId: artisanId,
        update: jest.fn().mockResolvedValue(true),
      };

      Product.findByPk.mockResolvedValue(mockProduct);
      Product.findByPk.mockResolvedValueOnce(mockProduct).mockResolvedValueOnce({
        ...mockProduct,
        isAvailable: false,
      });

      const response = await request(app)
        .patch(`/api/products/${productId}/availability`)
        .set('Authorization', `Bearer ${artisanToken}`)
        .send({ isAvailable: false });

      expect(response.status).toBe(200);
      expect(mockProduct.update).toHaveBeenCalledWith({ isAvailable: false });
    });
  });
});

