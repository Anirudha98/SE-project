import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const heroHighlights = [
  "Eco-friendly materials",
  "Curated & handmade",
  "Supports local artisans",
];

const featuredPieces = [
  {
    id: 101,
    title: "Handwoven Ceramic Bowl",
    category: "Pottery & Ceramics",
    description:
      "Seaside-inspired oceanic tones with natural glazes. Perfect for serving or a decorative centrepiece.",
    price: 45,
    artisan: "Priya Desai",
    image:
      "https://images.unsplash.com/photo-1439539698758-ba2680ecadb9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 205,
    title: "Sterling Silver Pendant",
    category: "Jewelry & Accessories",
    description:
      "Elegant handcrafted sterling silver pendant with intricate latticework and oxidised detailing.",
    price: 89,
    artisan: "Sachin Patel",
    image:
      "https://images.unsplash.com/photo-1518544801958-efcbf8a7ec10?auto=format&fit=crop&w=900&q=80",
  },
];

const homeStats = [
  { label: "Talented Artisans", value: "24" },
  { label: "Unique Products", value: "132" },
  { label: "Average Rating", value: "4.8" },
];

const Home = () => (
  <div className="home-page">
    <section className="hero">
      <div className="hero__content">
        <span className="hero__tag">Handpicked with Love</span>
        <h1>Discover Unique Handmade Treasure</h1>
        <p>
          Connect with talented artisans and find one-of-a-kind pieces that tell a story. Every
          purchase supports independent creators and their craft.
        </p>
        <div className="hero__highlights">
          {heroHighlights.map((highlight) => (
            <div key={highlight}>
              <span />
              {highlight}
            </div>
          ))}
        </div>
        <div className="hero__actions">
          <Link className="primary-button" to="/products">
            Shop Now
          </Link>
          <Link className="secondary-button" to="/products">
            Meet Artisans
          </Link>
          <div className="hero__rating">
            <div>
              <strong>4.8/5</strong>
              <p>Community rating</p>
            </div>
            <div className="hero__rating-bar">
              <span />
            </div>
          </div>
        </div>
      </div>
      <div className="hero__media">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80"
          alt="Artisan crafting pottery in a studio"
          loading="lazy"
        />
      </div>
    </section>

    <section className="featured">
      <p className="eyebrow">Featured Collection</p>
      <h2>Handpicked Masterpieces</h2>
      <p className="featured__intro">
        Discover our curated selection of exceptional handmade items, each piece carefully chosen for
        its quality and artistry.
      </p>
      <div className="featured__grid">
        {featuredPieces.map((piece) => (
          <article key={piece.id} className="featured-card">
            <div className="featured-card__image">
              <img src={piece.image} alt={piece.title} loading="lazy" />
              <span>{piece.category}</span>
            </div>
            <div className="featured-card__body">
              <h3>{piece.title}</h3>
              <p>{piece.description}</p>
              <div className="featured-card__meta">
                <div>
                  <strong>${piece.price.toFixed(2)}</strong>
                  <small> by {piece.artisan}</small>
                </div>
                <Link to="/products">View</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <Link className="ghost-link" to="/products">
        View All Products
      </Link>
    </section>

    <section className="home-stats">
      {homeStats.map((stat) => (
        <div key={stat.label}>
          <span>{stat.value}</span>
          <p>{stat.label}</p>
        </div>
      ))}
    </section>
  </div>
);

export default Home;
