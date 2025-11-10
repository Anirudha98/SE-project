import React, { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import "./ProductList.css";

const vibeFilters = [
  { id: "all", label: "All artistry" },
  { id: "statement", label: "Statement pieces", predicate: ({ price }) => price >= 150 },
  { id: "giftable", label: "Giftable finds", predicate: ({ price }) => price > 0 && price <= 60 },
  { id: "limited", label: "Limited stock", predicate: ({ stock }) => stock > 0 && stock <= 5 },
  { id: "made-to-order", label: "Made to order", predicate: ({ stock }) => stock === 0 },
];

const priceFilters = [
  { value: "all", label: "Any price" },
  { value: "under-50", label: "Under $50" },
  { value: "50-100", label: "$50 - $100" },
  { value: "100-200", label: "$100 - $200" },
  { value: "over-200", label: "$200+" },
];

const stockFilters = [
  { value: "all", label: "Availability" },
  { value: "in-stock", label: "Ready to ship" },
  { value: "limited", label: "Low inventory" },
  { value: "made-to-order", label: "Made to order" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "priceLowHigh", label: "Price: Low to High" },
  { value: "priceHighLow", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [activeVibe, setActiveVibe] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // 🔍 If searchQuery exists, call backend search endpoint
    const fetchProducts = async () => {
      try {
        const data = await getProducts(searchQuery);
        if (mounted) setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, [searchQuery]);

  const sortStrategies = {
    featured: (a, b) => (Number(b.stock ?? 0) || 0) - (Number(a.stock ?? 0) || 0),
    priceLowHigh: (a, b) => Number(a.price ?? 0) - Number(b.price ?? 0),
    priceHighLow: (a, b) => Number(b.price ?? 0) - Number(a.price ?? 0),
    newest: (a, b) => Number(b.id ?? 0) - Number(a.id ?? 0),
  };

  const filteredProducts = useMemo(() => {
    const vibeConfig = vibeFilters.find((filter) => filter.id === activeVibe);
    const subset = products.filter((product) => {
      const price = Number(product.price ?? 0);
      const stock = Number(product.stock ?? 0);

      switch (priceFilter) {
        case "under-50":
          if (!(price > 0 && price < 50)) return false;
          break;
        case "50-100":
          if (!(price >= 50 && price <= 100)) return false;
          break;
        case "100-200":
          if (!(price >= 100 && price <= 200)) return false;
          break;
        case "over-200":
          if (!(price > 200)) return false;
          break;
        default:
          break;
      }

      if (stockFilter === "in-stock" && stock <= 0) return false;
      if (stockFilter === "limited" && !(stock > 0 && stock <= 5)) return false;
      if (stockFilter === "made-to-order" && stock !== 0) return false;

      if (activeVibe !== "all" && vibeConfig?.predicate) {
        const matchesVibe = vibeConfig.predicate({ price, stock, product });
        if (!matchesVibe) return false;
      }

      return true;
    });

    const sorter = sortStrategies[sortBy] || sortStrategies.featured;
    return [...subset].sort(sorter);
  }, [products, priceFilter, stockFilter, sortBy, activeVibe]);

  const stats = useMemo(() => {
    if (!products.length) {
      return { total: 0, readyToShip: 0, uniqueArtisans: 0, averagePrice: 0 };
    }

    const readyToShip = products.filter((p) => Number(p.stock ?? 0) > 0).length;
    const uniqueArtisans = new Set(
      products.map((p) => p.artisanName || "Independent Artisan")
    ).size;
    const averagePrice =
      products.reduce((sum, p) => sum + Number(p.price ?? 0), 0) / products.length;

    return { total: products.length, readyToShip, uniqueArtisans, averagePrice };
  }, [products]);

  const activeFilters = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count += 1;
    if (priceFilter !== "all") count += 1;
    if (stockFilter !== "all") count += 1;
    if (activeVibe !== "all") count += 1;
    return count;
  }, [searchQuery, priceFilter, stockFilter, activeVibe]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setPriceFilter("all");
    setStockFilter("all");
    setActiveVibe("all");
    setSortBy("featured");
  };

  const renderSkeletons = Array.from({ length: 8 });

  return (
    <div className="product-page">
      <section className="product-hero">
        <div className="product-hero__eyebrow">Curated by KalaKrithi</div>
        <div className="product-hero__heading">
          <div>
            <h1>Explore Artistry</h1>
            <p>Discover limited batches handmade by artisans from across the country.</p>
          </div>
          <div className="product-hero__stats">
            <div className="product-hero__stat"><span>{stats.total}</span><p>Original pieces</p></div>
            <div className="product-hero__stat"><span>{stats.readyToShip}</span><p>Ready to ship</p></div>
            <div className="product-hero__stat"><span>{stats.uniqueArtisans}</span><p>Artisans featured</p></div>
            <div className="product-hero__stat"><span>${stats.averagePrice.toFixed(0)}</span><p>Avg. price</p></div>
          </div>
        </div>

        <form
          className="product-search"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="product-search__input">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M10 3a7 7 0 0 1 5.59 11.16l4.12 4.11a1 1 0 0 1-1.42 1.42l-4.11-4.12A7 7 0 1 1 10 3zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"
                fill="currentColor"
              />
            </svg>
            <input
              type="search"
              placeholder="Search by artisan, material, or mood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="ghost-button"
            onClick={handleResetFilters}
            disabled={!activeFilters && sortBy === "featured"}
          >
            Clear filters
          </button>
        </form>
      </section>

      <section className="product-toolbar">
        <div className="product-toolbar__chips">
          {vibeFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`product-chip ${activeVibe === filter.id ? "is-active" : ""}`}
              onClick={() => setActiveVibe(filter.id)}
              aria-pressed={activeVibe === filter.id}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="product-toolbar__controls">
          <select className="product-select" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
            {priceFilters.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select className="product-select" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
            {stockFilters.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select className="product-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="product-view-toggle" role="group" aria-label="View mode">
            {[
              { id: "grid", label: "Grid" },
              { id: "list", label: "Showcase" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={viewMode === opt.id ? "is-active" : ""}
                onClick={() => setViewMode(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        {loading ? (
          <div className="product-grid">
            {renderSkeletons.map((_, i) => (
              <div className="product-skeleton" key={`skeleton-${i}`}>
                <div className="product-skeleton__image" />
                <div className="product-skeleton__text" />
                <div className="product-skeleton__text short" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length ? (
          <div className={`product-grid product-grid--${viewMode}`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="product-empty">
            <h3>No pieces match your selection</h3>
            <p>Try a different artisan, reset the filters, or explore another vibe.</p>
            <button type="button" onClick={handleResetFilters}>Reset filters</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductList;
