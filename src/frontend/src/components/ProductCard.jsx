import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <div
    style={{
      border: "1px solid #ccc",
      borderRadius: "10px",
      margin: "10px",
      padding: "15px",
      width: "220px",
      textAlign: "center",
    }}
  >
    <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <img
        src={product.imageUrl}
        alt={product.name}
        style={{ width: "100%", borderRadius: "10px" }}
      />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <p><i>{product.artisanName}</i></p>
    </Link>
  </div>
);

export default ProductCard;
