import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav style={{ background: "#222", padding: "10px" }}>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          justifyContent: "space-around",
          margin: 0,
          color: "#fff",
        }}
      >
        <li>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/products" style={{ color: "#fff", textDecoration: "none" }}>
            Products
          </Link>
        </li>
        <li>
          <Link to="/cart" style={{ color: "#fff", textDecoration: "none" }}>
            🛒 Cart ({cartCount})
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
