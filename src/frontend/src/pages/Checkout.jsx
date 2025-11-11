import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { createOrder } from "../services/api";

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const asNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const total = cart.reduce((sum, item) => sum + asNumber(item.price) * item.qty, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const payload = cart.map((item) => ({
        productId: item.id,
        qty: item.qty,
      }));
      const response = await createOrder(payload);
      clearCart();
      setSuccessMessage(`Order #${response.orderId} placed successfully!`);
      setTimeout(() => navigate("/orders"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Checkout</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul style={styles.list}>
            {cart.map((item) => {
              const price = asNumber(item.price);
              return (
                <li key={item.id} style={styles.listItem}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      Qty: {item.qty} × ${price.toFixed(2)}
                    </p>
                  </div>
                  <span>${(price * item.qty).toFixed(2)}</span>
                </li>
              );
            })}
          </ul>
          <h3 style={{ textAlign: "right" }}>Total: ${total.toFixed(2)}</h3>
          {error && <p style={styles.error}>{error}</p>}
          {successMessage && <p style={styles.success}>{successMessage}</p>}
          <button onClick={handlePlaceOrder} disabled={loading} style={styles.button}>
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "30px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    padding: "10px 0",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: { color: "red" },
  success: { color: "green" },
};

export default Checkout;
