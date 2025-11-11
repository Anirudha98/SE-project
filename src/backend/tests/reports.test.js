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
const Order = require('../src/models/Order');
const Product = require('../src/models/productModel');

// Helper to generate JWT token
const generateToken = (userId, role = 'artisan') => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

describe('Report Endpoints', () => {
  const artisanId = '11111111-1111-1111-1111-111111111111';
  const adminId = '22222222-2222-2222-2222-222222222222';
  const artisanToken = generateToken(artisanId, 'artisan');
  const adminToken = generateToken(adminId, 'admin');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/reports/overview', () => {
    it('returns overview statistics for artisan', async () => {
      const mockOrders = [
        {
          id: 1,
          createdAt: new Date(),
          status: 'PLACED',
          items: [
            {
              id: 'item-1',
              lineTotal: '50.00',
              qty: 2,
              product: { id: 'prod-1', artisanId: artisanId },
            },
          ],
        },
      ];

      Order.findAll.mockResolvedValue(mockOrders);

      const response = await request(app)
        .get('/api/reports/overview')
        .set('Authorization', `Bearer ${artisanToken}`)
        .query({ start: '2024-01-01', end: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('revenueTotal');
      expect(response.body).toHaveProperty('ordersCount');
      expect(response.body).toHaveProperty('unitsSold');
      expect(response.body).toHaveProperty('avgOrderValue');
    });

    it('requires authentication', async () => {
      const response = await request(app).get('/api/reports/overview');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/reports/low-stock', () => {
    it('returns low stock products', async () => {
      const mockProducts = [
        { id: 'prod-1', name: 'Product 1', stock: 3 },
        { id: 'prod-2', name: 'Product 2', stock: 5 },
      ];

      Product.findAll.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/reports/low-stock')
        .set('Authorization', `Bearer ${artisanToken}`)
        .query({ threshold: 5 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(Product.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /api/reports/sales-daily', () => {
    it('returns daily sales data', async () => {
      const mockOrders = [
        {
          id: 1,
          createdAt: new Date('2024-01-15'),
          status: 'PLACED',
          items: [
            {
              id: 'item-1',
              lineTotal: '50.00',
              qty: 2,
              product: { id: 'prod-1', artisanId: artisanId },
            },
          ],
        },
      ];

      Order.findAll.mockResolvedValue(mockOrders);

      const response = await request(app)
        .get('/api/reports/sales-daily')
        .set('Authorization', `Bearer ${artisanToken}`)
        .query({ start: '2024-01-01', end: '2024-01-31' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('validates date range', async () => {
      const response = await request(app)
        .get('/api/reports/sales-daily')
        .set('Authorization', `Bearer ${artisanToken}`)
        .query({ start: 'invalid-date', end: '2024-12-31' });

      expect(response.status).toBe(400);
    });
  });
});

