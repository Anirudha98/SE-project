import React, { useEffect, useState } from "react";

function Catalog() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/catalog${search ? `?search=${search}` : ""}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading catalog:", err));
  }, [search]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛍️ Product Catalog</h1>

      <input
        className="border p-2 w-full mb-4"
        type="text"
        placeholder="Search for a product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-600">By: {product.artisan}</p>
            <p className="text-gray-800">₹{product.price}</p>
            <p className="text-sm mt-2">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog;