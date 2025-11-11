import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../services/api";
import { CartContext } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const found = data.find((p) => String(p.id) === id);
        setProduct(found);
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  if (!product) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <img
        src={product.imageUrl}
        alt={product.name}
        style={{ width: "300px", borderRadius: "10px" }}
      />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <h3>${Number(product.price).toFixed(2)}</h3>
      <p>By: {product.artisanName}</p>
      <button
        onClick={() => addToCart(product)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetail;
