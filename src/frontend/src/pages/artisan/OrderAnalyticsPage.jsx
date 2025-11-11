import React, { useEffect, useState } from 'react';
import { listOrdersByArtisan, getOrderDetailForArtisan } from '../../api/orders';

const OrderAnalyticsPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadOrders();
  }, [page, startDate, endDate]);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listOrdersByArtisan({
        page,
        pageSize: 20,
        start: startDate || undefined,
        end: endDate || undefined,
      });
      setOrders(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const data = await getOrderDetailForArtisan(orderId);
      setSelectedOrder(data.order);
    } catch (err) {
      alert(err.message || 'Failed to load order details');
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div style={styles.container}>
      <h1>Order Analytics</h1>

      <div style={styles.filters}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.dateInput}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.dateInput}
          />
        </label>
        <button onClick={() => {
          setStartDate('');
          setEndDate('');
        }} style={styles.clearButton}>
          Clear Filters
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div>Loading orders...</div>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>#{order.orderId}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.itemCount}</td>
                  <td>${order.totalForThisArtisan.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td>
                    <button
                      onClick={() => handleViewOrder(order.orderId)}
                      style={styles.viewButton}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              style={styles.pageButton}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              style={styles.pageButton}
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedOrder && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>Order #{selectedOrder.id}</h2>
              <button onClick={closeModal} style={styles.closeButton}>
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              {selectedOrder.buyer && (
                <div>
                  <p><strong>Buyer:</strong> {selectedOrder.buyer.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.buyer.email}</p>
                </div>
              )}
              <h3>Items</h3>
              <table style={styles.itemTable}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${item.lineTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={styles.total}>
                <strong>Total: ${selectedOrder.totalForThisArtisan.toFixed(2)}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  filters: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    alignItems: 'center',
  },
  dateInput: {
    padding: '8px',
    marginLeft: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  clearButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  viewButton: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
  },
  pageButton: {
    padding: '8px 16px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  closeButton: {
    fontSize: '24px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  modalBody: {
    marginTop: '20px',
  },
  itemTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  total: {
    marginTop: '20px',
    fontSize: '18px',
    textAlign: 'right',
  },
};

export default OrderAnalyticsPage;

