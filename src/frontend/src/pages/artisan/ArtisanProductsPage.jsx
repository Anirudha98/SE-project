import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  listMyProducts,
  addProduct,
  updateMyProduct,
  updateStock,
  setAvailability,
} from "../../api/products";

const defaultForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  artisanName: "",
};

const ArtisanProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState(defaultForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mutationId, setMutationId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let timeout;
    if (toast) {
      timeout = setTimeout(() => setToast(null), 2600);
    }
    return () => clearTimeout(timeout);
  }, [toast]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingProduct(null);
    setShowForm(false);
  };

  const loadProducts = useCallback(
    async (pageOverride) => {
      const targetPage = pageOverride ?? page;
      setLoading(true);
      try {
        const data = await listMyProducts({ page: targetPage, pageSize: 20 });
        setProducts(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        showToast(err.message || "Failed to load products", "error");
      } finally {
        setLoading(false);
      }
    },
    [page, showToast]
  );

  useEffect(() => {
    loadProducts(page);
  }, [page, loadProducts]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (editingProduct) {
        await updateMyProduct(editingProduct.id, formData);
        showToast("Product updated");
      } else {
        await addProduct(formData);
        showToast("Product added");
      }
      resetForm();
      loadProducts();
    } catch (err) {
      showToast(err.message || "Unable to save product", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStockUpdate = async (productId, delta, currentStock) => {
    if (delta < 0 && currentStock + delta < 0) {
      showToast("Stock cannot go below zero", "error");
      return;
    }
    setMutationId(productId);
    try {
      await updateStock(productId, { delta });
      showToast("Stock updated");
      loadProducts();
    } catch (err) {
      showToast(err.message || "Failed to update stock", "error");
    } finally {
      setMutationId(null);
    }
  };

  const handleAvailabilityToggle = async (productId, value) => {
    setMutationId(productId);
    try {
      await setAvailability(productId, !value);
      showToast(`Product ${value ? "hidden" : "made available"}`);
      loadProducts();
    } catch (err) {
      showToast(err.message || "Failed to update availability", "error");
    } finally {
      setMutationId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    return products.filter((product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const startProductEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock ?? "",
      imageUrl: product.imageUrl || "",
      artisanName: product.artisanName || "",
    });
    setShowForm(true);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Inventory</p>
          <h1 style={styles.title}>Artisan Product Listing</h1>
          <p style={styles.subtitle}>
            Add handcrafted pieces, update availability, and manage stock in one place.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (editingProduct) {
              resetForm();
            } else {
              setShowForm(!showForm);
            }
          }}
          style={styles.primaryButton}
        >
          {showForm ? "Close Panel" : "Add Product"}
        </button>
      </header>

      {toast && (
        <div
          style={{
            ...styles.toast,
            ...(toast.type === "error" ? styles.toastError : styles.toastSuccess),
          }}
        >
          {toast.message}
        </div>
      )}

      {showForm && (
        <section style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
            {editingProduct && (
              <button type="button" onClick={resetForm} style={styles.textButton}>
                Cancel edit
              </button>
            )}
          </div>
          <form onSubmit={handleFormSubmit} style={styles.formGrid}>
            <label style={styles.label}>
              Name *
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Description
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                style={{ ...styles.input, resize: "vertical" }}
              />
            </label>
            <div style={styles.inlineFields}>
              <label style={styles.label}>
                Price *
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                Stock *
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                Artisan name
                <input
                  type="text"
                  value={formData.artisanName}
                  onChange={(e) => setFormData({ ...formData, artisanName: e.target.value })}
                  style={styles.input}
                />
              </label>
            </div>
            <label style={styles.label}>
              Image URL
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://"
                style={styles.input}
              />
            </label>
            <div style={styles.formActions}>
              <button type="submit" style={styles.primaryButton} disabled={submitting}>
                {submitting ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
              </button>
              <button type="button" onClick={resetForm} style={styles.secondaryButton}>
                Reset
              </button>
            </div>
          </form>
        </section>
      )}

      <section style={styles.inventoryCard}>
        <div style={styles.tableHeader}>
          <h2>Live Inventory</h2>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {loading ? (
          <p style={styles.muted}>Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p style={styles.muted}>No products match your filters.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Status</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} style={styles.tr}>
                    <td style={styles.td}>
                      <strong>{product.name}</strong>
                      <br />
                      <small style={styles.muted}>
                        {product.artisanName || "Independent artisan"}
                      </small>
                    </td>
                    <td style={styles.td}>${Number(product.price || 0).toFixed(2)}</td>
                    <td style={{ ...styles.td, ...styles.stockCell }}>
                      <span style={styles.stockValue}>{product.stock}</span>
                      <div style={styles.stockButtons}>
                        <button
                          type="button"
                          disabled={product.stock === 0 || mutationId === product.id}
                          onClick={() => handleStockUpdate(product.id, -1, product.stock)}
                          style={{
                            ...styles.stockActionButton,
                            opacity: product.stock === 0 || mutationId === product.id ? 0.4 : 1,
                          }}
                        >
                          −
                        </button>
                        <button
                          type="button"
                          disabled={mutationId === product.id}
                          onClick={() => handleStockUpdate(product.id, 1, product.stock)}
                          style={{
                            ...styles.stockActionButton,
                            opacity: mutationId === product.id ? 0.4 : 1,
                          }}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <label style={styles.switch}>
                        <input
                          type="checkbox"
                          checked={Boolean(product.isAvailable)}
                          onChange={() =>
                            handleAvailabilityToggle(product.id, product.isAvailable)
                          }
                          disabled={mutationId === product.id}
                          style={styles.hiddenCheckbox}
                        />
                        <span
                          style={{
                            ...styles.sliderTrack,
                            justifyContent: product.isAvailable ? "flex-end" : "flex-start",
                            backgroundColor: product.isAvailable ? "#34d399" : "#cbd5f5",
                            opacity: mutationId === product.id ? 0.65 : 1,
                          }}
                        >
                          <span style={styles.sliderKnob} />
                        </span>
                      </label>
                    </td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => startProductEdit(product)}
                        style={styles.textButton}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={styles.pagination}>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            style={styles.paginationButton}
          >
            Previous
          </button>
          <span>
            Page {page} of {Math.max(totalPages, 1)}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
            style={styles.paginationButton}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

const baseInputStyle = {
  borderRadius: "8px",
  border: "1px solid #d7dce5",
  padding: "10px 12px",
  fontSize: "14px",
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    fontSize: "12px",
    color: "#7c8da6",
    margin: 0,
  },
  title: {
    margin: "8px 0 4px",
    fontSize: "28px",
  },
  subtitle: {
    margin: 0,
    color: "#5f6b7a",
  },
  primaryButton: {
    background: "#2b50d4",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 18px",
    cursor: "pointer",
  },
  secondaryButton: {
    background: "#e7ecf3",
    color: "#1f2a37",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    cursor: "pointer",
  },
  formCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
    marginBottom: "24px",
  },
  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  formGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#2b3245",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  input: baseInputStyle,
  inlineFields: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
  },
  formActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  inventoryCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  searchInput: {
    ...baseInputStyle,
    minWidth: "220px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px 10px",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#718096",
    borderBottom: "1px solid #e5e7eb",
  },
  tr: {
    borderBottom: "1px solid #edf2f7",
  },
  td: {
    padding: "14px 10px",
    verticalAlign: "top",
    fontSize: "14px",
  },
  stockCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  stockValue: {
    fontWeight: 600,
    minWidth: "24px",
    textAlign: "center",
  },
  stockButtons: {
    display: "flex",
    gap: "6px",
  },
  stockActionButton: {
    border: "1px solid #cbd5f5",
    background: "#fff",
    borderRadius: "6px",
    width: "32px",
    height: "28px",
    cursor: "pointer",
  },
  switch: {
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
  },
  hiddenCheckbox: {
    display: "none",
  },
  sliderTrack: {
    width: "46px",
    height: "24px",
    borderRadius: "12px",
    padding: "3px",
    display: "flex",
    transition: "0.2s",
  },
  sliderKnob: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
  },
  textButton: {
    background: "none",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: 600,
  },
  toast: {
    padding: "12px 16px",
    borderRadius: "10px",
    marginBottom: "16px",
    fontWeight: 600,
  },
  toastSuccess: {
    background: "rgba(34,197,94,0.12)",
    color: "#166534",
  },
  toastError: {
    background: "rgba(248,113,113,0.12)",
    color: "#991b1b",
  },
  muted: {
    color: "#6b7280",
    fontSize: "14px",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "16px",
  },
  paginationButton: {
    ...baseInputStyle,
    background: "#fff",
    cursor: "pointer",
  },
};

export default ArtisanProductsPage;
