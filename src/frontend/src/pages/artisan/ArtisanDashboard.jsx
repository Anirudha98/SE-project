import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOverview, getLowStock } from '../../api/reports';
import { updateStock } from '../../api/products';

const ArtisanDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30'); // days
  const [updatingStock, setUpdatingStock] = useState(null);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const days = parseInt(dateRange, 10);
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      const [overviewData, lowStockData] = await Promise.all([
        getOverview({ start: startDateStr, end: endDate }),
        getLowStock({ threshold: 5 }),
      ]);

      setOverview(overviewData);
      setLowStock(lowStockData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (productId, currentStock) => {
    setUpdatingStock(productId);
    try {
      await updateStock(productId, { delta: 5 });
      setLowStock((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: currentStock + 5 } : p))
      );
    } catch (err) {
      alert(err.message || 'Failed to update stock');
    } finally {
      setUpdatingStock(null);
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading dashboard...</div>;
  }

  if (error) {
    return <div style={styles.container}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Artisan Dashboard</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={styles.select}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Revenue</h3>
          <p style={styles.metric}>${overview?.revenueTotal?.toFixed(2) || '0.00'}</p>
        </div>
        <div style={styles.card}>
          <h3>Orders</h3>
          <p style={styles.metric}>{overview?.ordersCount || 0}</p>
        </div>
        <div style={styles.card}>
          <h3>Units Sold</h3>
          <p style={styles.metric}>{overview?.unitsSold || 0}</p>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Low Stock Products</h2>
        {lowStock.length === 0 ? (
          <p>No products with low stock</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      onClick={() => handleAddStock(product.id, product.stock)}
                      disabled={updatingStock === product.id}
                      style={styles.button}
                    >
                      {updatingStock === product.id ? 'Updating...' : 'Add +5'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link to="/artisan/products" style={styles.link}>
          Manage Products →
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  select: {
    padding: '8px',
    fontSize: '16px',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  card: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
  },
  metric: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '10px 0',
  },
  section: {
    marginTop: '40px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  button: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  link: {
    display: 'inline-block',
    marginTop: '15px',
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default ArtisanDashboard;

