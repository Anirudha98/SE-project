import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to the Handcrafted Marketplace</h1>
      <p>Discover beautiful handmade products from artisans around you.</p>
      <Link to="/products">
        <button
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          View Products
        </button>
      </Link>
    </div>
  );
};

export default Home;
