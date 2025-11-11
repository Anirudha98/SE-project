import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOverview, getSalesDaily, getLowStock } from '../../api/reports';

// Optional recharts - uncomment and install recharts if you want charts
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const HAS_RECHARTS = false; // Set to true if recharts is installed

const ArtisanReportsPage = () => {
  const [overview, setOverview] = useState(null);
  const [dailySales, setDailySales] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [overviewData, dailyData, lowStockData] = await Promise.all([
        getOverview({ start: startDate, end: endDate }),
        getSalesDaily({ start: startDate, end: endDate }),
        getLowStock({ threshold: 5 }),
      ]);

      setOverview(overviewData);
      setDailySales(dailyData);
      setLowStock(lowStockData);
    } catch (err) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading reports...</div>;
  }

  if (error) {
    return <div style={styles.container}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1>Sales Reports</h1>

      <div style={styles.dateRange}>
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
      </div>

      <div style={styles.metrics}>
        <div style={styles.metricCard}>
          <h3>Total Revenue</h3>
          <p style={styles.metricValue}>${overview?.revenueTotal?.toFixed(2) || '0.00'}</p>
        </div>
        <div style={styles.metricCard}>
          <h3>Orders Count</h3>
          <p style={styles.metricValue}>{overview?.ordersCount || 0}</p>
        </div>
        <div style={styles.metricCard}>
          <h3>Units Sold</h3>
          <p style={styles.metricValue}>{overview?.unitsSold || 0}</p>
        </div>
        <div style={styles.metricCard}>
          <h3>Average Order Value</h3>
          <p style={styles.metricValue}>${overview?.avgOrderValue?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div style={styles.chartSection}>
        <h2>Sales Over Time</h2>
        {dailySales.length > 0 ? (
          <table style={styles.salesTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Revenue</th>
                <th>Orders</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              {dailySales.map((day) => (
                <tr key={day.date}>
                  <td>{day.date}</td>
                  <td>${day.revenue.toFixed(2)}</td>
                  <td>{day.orders}</td>
                  <td>{day.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No sales data available for the selected date range</p>
        )}
        {HAS_RECHARTS && (
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Note: Install recharts package to enable chart visualization
          </p>
        )}
      </div>

      <div style={styles.lowStockSection}>
        <h2>Low Stock Products</h2>
        {lowStock.length === 0 ? (
          <p>No products with low stock</p>
        ) : (
          <ul>
            {lowStock.map((product) => (
              <li key={product.id}>
                {product.name} - Stock: {product.stock}
              </li>
            ))}
          </ul>
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
  dateRange: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
  },
  dateInput: {
    padding: '8px',
    marginLeft: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  metricCard: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '10px 0',
  },
  chartSection: {
    marginBottom: '40px',
  },
  salesTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  lowStockSection: {
    marginTop: '40px',
  },
  link: {
    display: 'inline-block',
    marginTop: '15px',
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default ArtisanReportsPage;

