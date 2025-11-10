import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../services/api";
import { CartContext } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    let isMounted = true;
    getProducts()
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((p) => p.id === parseInt(id, 10));
          if (isMounted) {
            if (found) setProduct(found);
            else setError("Product not found.");
          }
        } else {
          setError("Invalid product data received.");
        }
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (error) {
    return <h2 style={{ textAlign: "center", color: "red", marginTop: "40px" }}>{error}</h2>;
  }

  if (!product) {
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading...</h2>;
  }

  const price = Number(product.price ?? 0);
  const stock = Number(product.stock ?? 0);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <img
        src={product.imageUrl || "https://via.placeholder.com/300"}
        alt={product.name || "Product"}
        style={{ width: "300px", borderRadius: "10px", marginBottom: "20px" }}
      />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <h3>₹{price.toFixed(2)}</h3>
      <p>By: {product.artisanName || "Unknown Artisan"}</p>
      <p style={{ fontWeight: "bold", color: stock > 0 ? "green" : "red" }}>
        {stock > 0 ? `In Stock (${stock} available)` : "Out of Stock"}
      </p>
      <button
        onClick={() => addToCart(product)}
        disabled={stock <= 0}
        style={{
          padding: "10px 20px",
          backgroundColor: stock > 0 ? "#28a745" : "gray",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: stock > 0 ? "pointer" : "not-allowed",
          opacity: stock > 0 ? 1 : 0.8,
        }}
      >
        {stock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
};

export default ProductDetail;
