import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
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
        <li><Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link></li>
        <li><Link to="/products" style={{ color: "#fff", textDecoration: "none" }}>Products</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
