import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const fallbackDescription =
  "Elegant textures and meticulously detailed finishes straight from the artisan's studio.";

const placeholderImage =
  "https://images.unsplash.com/photo-1468858813774-8b595019d83f?auto=format&fit=crop&w=900&q=80";

const ProductCard = ({ product, viewMode = "grid" }) => {
  if (!product) {
    return null;
  }

  const price = Number(product.price ?? 0);
  const stock = Number.isFinite(Number(product.stock)) ? Number(product.stock) : 0;
  const hasStock = stock > 0;
  const badgeLabel = hasStock
    ? stock <= 5
      ? "Limited run"
      : "In studio"
    : "Made to order";
  const description = product.description?.trim() || fallbackDescription;
  const artisanName = product.artisanName || "Independent Artisan";

  return (
    <article
      className={`product-card product-card--${viewMode} ${
        !hasStock ? "product-card--coming-soon" : ""
      }`}
    >
      <div className="product-card__media">
        <img
          src={product.imageUrl || placeholderImage}
          alt={product.name}
          loading="lazy"
        />
        <span className="product-card__badge">{badgeLabel}</span>
        <div className="product-card__media-overlay">
          <span>{hasStock ? `${stock} ready to ship` : "Crafted on request"}</span>
          <Link to={`/product/${product.id}`} className="product-card__ghost-button">
            View details
          </Link>
        </div>
      </div>
      <div className="product-card__body">
        <p className="product-card__collection">Featured artisan</p>
        <h3>{product.name}</h3>
        <p className="product-card__artisan">by {artisanName}</p>
        <p className="product-card__description">{description}</p>
        <div className="product-card__meta">
          <div>
            <span className="product-card__price">${price.toFixed(2)}</span>
            <span className="product-card__availability">
              {hasStock ? "Ships in 3-5 days" : "Timeline shared on booking"}
            </span>
          </div>
          <Link to={`/product/${product.id}`} className="product-card__cta">
            View piece
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
