import React, { useEffect, useState } from "react";
import { downloadInvoice, getMyOrders } from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setFetchError(err.response?.data?.message || "Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleInvoiceDownload = async (orderId) => {
    setDownloadingId(orderId);
    try {
      await downloadInvoice(orderId);
    } catch (err) {
      console.error("Error downloading invoice:", err);
      const message = err.response?.data?.message || "Could not download invoice.";
      if (typeof window !== "undefined") {
        window.alert(message);
      }
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return <p style={styles.message}>Loading your orders...</p>;
  }

  if (fetchError) {
    return <p style={{ ...styles.message, color: "red" }}>{fetchError}</p>;
  }

  if (orders.length === 0) {
    return <p style={styles.message}>You have not placed any orders yet.</p>;
  }

  return (
    <div style={styles.container}>
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order.id} style={styles.card}>
          <div style={styles.header}>
            <div>
              <p>
                <strong>Order #{order.id}</strong>
              </p>
              <p>Status: {order.status || "Pending"}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p>Total: ₹{Number(order.totalAmount || order.total || 0).toFixed(2)}</p>
              <p>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}</p>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <ul style={styles.itemList}>
              {order.items.map((item) => (
                <li key={item.id} style={styles.itemRow}>
                  <span>
                    {item.name || item.Product?.name} (x{item.qty || item.quantity})
                  </span>
                  <span>₹{Number(item.lineTotal || item.price || 0).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}

          <div style={styles.actions}>
            <button
              onClick={() => handleInvoiceDownload(order.id)}
              style={{
                ...styles.button,
                opacity: downloadingId === order.id ? 0.7 : 1,
              }}
              disabled={downloadingId === order.id}
              aria-busy={downloadingId === order.id}
            >
              {downloadingId === order.id ? "Downloading..." : "Download Invoice"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "30px auto",
    padding: "0 15px",
  },
  message: {
    textAlign: "center",
    marginTop: "40px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  itemList: {
    listStyle: "none",
    padding: 0,
    margin: "10px 0",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    borderBottom: "1px solid #f3f3f3",
  },
  actions: {
    textAlign: "right",
    marginTop: "10px",
  },
  button: {
    padding: "8px 12px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Orders;
