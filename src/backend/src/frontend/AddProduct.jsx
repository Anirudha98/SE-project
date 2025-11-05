import React, { useState } from "react";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    artisan: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Product added successfully!");
        setFormData({ name: "", price: "", artisan: "", description: "" });
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("❌ Failed to add product. Try again.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧵 Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border p-2 w-full rounded"
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          className="border p-2 w-full rounded"
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={formData.price}
          onChange={handleChange}
        />
        <input
          className="border p-2 w-full rounded"
          type="text"
          name="artisan"
          placeholder="Artisan Name"
          value={formData.artisan}
          onChange={handleChange}
        />
        <textarea
          className="border p-2 w-full rounded"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 w-full"
        >
          Add Product
        </button>
      </form>

      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
}

export default AddProduct;
