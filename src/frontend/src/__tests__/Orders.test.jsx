import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Orders from '../pages/Orders';
import { downloadInvoice, getMyOrders } from '../services/api';

jest.mock('../services/api', () => ({
  getMyOrders: jest.fn(),
  downloadInvoice: jest.fn(),
}));

const mockOrders = [
  {
    id: 101,
    status: 'PLACED',
    total: 89,
    createdAt: new Date('2024-03-01T10:00:00Z').toISOString(),
    items: [
      { id: 1, name: 'Handmade Bowl', qty: 1, lineTotal: 45 },
      { id: 2, name: 'Artisan Pendant', qty: 1, lineTotal: 44 },
    ],
  },
];

describe('Orders page invoice actions', () => {
  const originalAlert = window.alert;

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    getMyOrders.mockResolvedValue(mockOrders);
    downloadInvoice.mockResolvedValue();
  });

  afterAll(() => {
    window.alert = originalAlert;
  });

  it('renders a Download Invoice button for fetched orders', async () => {
    render(<Orders />);
    const button = await screen.findByRole('button', { name: /download invoice/i });
    expect(button).toBeInTheDocument();
  });

  it('invokes downloadInvoice when the action button is clicked', async () => {
    render(<Orders />);
    const button = await screen.findByRole('button', { name: /download invoice/i });
    button.click();

    await waitFor(() => {
      expect(downloadInvoice).toHaveBeenCalledWith(mockOrders[0].id);
    });
  });
});
