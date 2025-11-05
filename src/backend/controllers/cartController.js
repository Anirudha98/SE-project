// Temporary in-memory cart (no database yet)
let cart = [];

// Add item to cart
exports.addToCart = (req, res) => {
  const { id, name, price, quantity } = req.body;

  if (!id || !name || !price || !quantity) {
    return res.status(400).json({ error: "Missing product fields" });
  }

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id, name, price, quantity });
  }

  res.status(200).json({ message: "Item added to cart", cart });
};

// Get all items in cart
exports.getCart = (req, res) => {
  res.status(200).json(cart);
};

// Checkout (clears cart and returns order summary)
exports.checkout = (req, res) => {
  if (cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    id: Math.floor(Math.random() * 10000),
    date: new Date(),
    items: cart,
    total,
  };

  cart = []; // clear cart after checkout
  res.status(200).json({ message: "Order placed successfully", order });
};
