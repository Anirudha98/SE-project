import React, { useEffect, useState } from "react";
import { getProducts } from "../services/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Products</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              margin: "10px",
              padding: "15px",
              width: "220px",
              textAlign: "center",
            }}
          >
            <img
              src={p.imageUrl}
              alt={p.name}
              style={{ width: "100%", borderRadius: "10px" }}
            />
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <p><i>{p.artisanName}</i></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
