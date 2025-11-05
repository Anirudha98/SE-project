import React, { useState, useEffect } from "react";

function Cart() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", price: "", quantity: 1 });
  const [order, setOrder] = useState(null);

  const fetchCart = async () => {
    const res = await fetch("http://localhost:5000/api/cart");
    const data = await res.json();
    setCart(data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleAdd = async () => {
    await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: parseInt(form.id),
        name: form.name,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      }),
    });
    fetchCart();
  };

  const handleCheckout = async () => {
    const res = await fetch("http://localhost:5000/api/cart/checkout", {
      method: "POST",
    });
    const data = await res.json();
    setOrder(data.order);
    setCart([]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Cart & Checkout</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add to Cart</h2>
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="Product ID"
          onChange={(e) => setForm({ ...form, id: e.target.value })}
        />
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2 mr-2"
          type="number"
          placeholder="Price"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          className="border p-2 mr-2"
          type="number"
          placeholder="Qty"
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Cart Items</h2>
        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} x {item.quantity} = ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleCheckout}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Checkout
      </button>

      {order && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold">✅ Order Summary</h2>
          <p>Order ID: {order.id}</p>
          <p>Date: {new Date(order.date).toLocaleString()}</p>
          <p>Total: ₹{order.total}</p>
        </div>
      )}
    </div>
  );
}

export default Cart;
