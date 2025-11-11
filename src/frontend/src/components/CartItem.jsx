import React from "react";

const CartItem = ({ item, removeFromCart }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #ccc",
      padding: "10px",
    }}
  >
    <div>
      <h4>{item.name}</h4>
      <p>
        ${Number(item.price).toFixed(2)} x {item.qty}
      </p>
    </div>
    <button
      onClick={() => removeFromCart(item.id)}
      style={{
        background: "red",
        color: "white",
        border: "none",
        borderRadius: "5px",
        padding: "5px 10px",
        cursor: "pointer",
      }}
    >
      Remove
    </button>
  </div>
);

export default CartItem;
