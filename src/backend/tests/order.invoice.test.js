process.env.NODE_ENV = 'test';

const { Readable } = require('stream');

// Mock all models before server loads to prevent association errors
jest.mock('../src/models/User', () => ({
  hasMany: jest.fn(),
}));

jest.mock('../src/models/Order', () => ({
  findByPk: jest.fn(),
  belongsTo: jest.fn(),
  hasMany: jest.fn(),
}));

jest.mock('../src/models/OrderItem', () => ({
  belongsTo: jest.fn(),
}));

jest.mock('../src/models/productModel', () => ({
  hasMany: jest.fn(),
}));

jest.mock('../src/utils/invoice', () => ({
  buildInvoiceStream: jest.fn(),
}));

jest.mock('../src/middleware/auth', () => {
  const authenticate = (req, res, next) => {
    req.user = authenticate.mockUser || { id: 'user-1', role: 'user' };
    next();
  };
  authenticate.setUser = (user) => {
    authenticate.mockUser = user;
  };
  return { authenticate };
});

const request = require('supertest');
const Order = require('../src/models/Order');
const { buildInvoiceStream } = require('../src/utils/invoice');
const { authenticate } = require('../src/middleware/auth');
const { app } = require('../server');

const createOrder = () => ({
  id: 321,
  userId: 'user-42',
  total: '120.00',
  status: 'PLACED',
  createdAt: '2024-01-01T00:00:00.000Z',
  user: { id: 'user-42', name: 'Asha Rao', email: 'asha@example.com' },
  items: [
    { id: 'item-1', name: 'Ceramic Bowl', price: '40.00', qty: 1, lineTotal: '40.00' },
    { id: 'item-2', name: 'Silver Pendant', price: '80.00', qty: 1, lineTotal: '80.00' },
  ],
});

const asReadable = (content) => Readable.from([content]);

describe('GET /api/orders/:id/invoice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authenticate.setUser({ id: 'user-42', role: 'user' });
  });

  it('streams a PDF invoice for the owner', async () => {
    const mockOrder = createOrder();
    Order.findByPk.mockResolvedValue(mockOrder);
    buildInvoiceStream.mockReturnValue(asReadable('PDFDATA'));

    const response = await request(app)
      .get(`/api/orders/${mockOrder.id}/invoice`)
      .buffer(true)
      .parse((res, callback) => {
        res.setEncoding('binary');
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => { callback(null, data); });
      });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/application\/pdf/);
    expect(response.headers['content-disposition']).toContain(`invoice_${mockOrder.id}.pdf`);
    expect(buildInvoiceStream).toHaveBeenCalledWith(mockOrder, mockOrder.user);
    expect(response.body).toBe('PDFDATA');
  });

  it('returns 403 for non-owner non-admin access', async () => {
    const mockOrder = createOrder();
    Order.findByPk.mockResolvedValue(mockOrder);
    authenticate.setUser({ id: 'user-99', role: 'user' });

    const response = await request(app).get(`/api/orders/${mockOrder.id}/invoice`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('You do not have access to this order');
    expect(buildInvoiceStream).not.toHaveBeenCalled();
  });

  it('returns 404 when the order does not exist', async () => {
    Order.findByPk.mockResolvedValue(null);

    const response = await request(app).get('/api/orders/999/invoice');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Order not found');
    expect(buildInvoiceStream).not.toHaveBeenCalled();
  });
});
