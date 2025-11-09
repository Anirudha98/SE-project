import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import CartItem from "../components/CartItem";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <CartItem key={item.id} item={item} removeFromCart={removeFromCart} />
          ))}
          <h3 style={{ textAlign: "right" }}>Total: ${total.toFixed(2)}</h3>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              onClick={clearCart}
              style={{
                flex: 1,
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "10px 15px",
                cursor: "pointer",
              }}
            >
              Clear Cart
            </button>
            <button
              onClick={() => navigate("/checkout")}
              style={{
                flex: 1,
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "10px 15px",
                cursor: "pointer",
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
