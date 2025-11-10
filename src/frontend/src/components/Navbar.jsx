import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { isAuthenticated, user, logout } = useAuth();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userRole = user?.role || "buyer";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎨</span>
          <span className="logo-text">Handcrafted</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/products" className="nav-link">
            Products
          </Link>
          <Link to="/cart" className="nav-link cart-link">
            <span className="cart-icon">🛒</span>
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* Role-based links */}
          {isAuthenticated && userRole === "buyer" && (
            <Link to="/orders" className="nav-link">
              Orders
            </Link>
          )}
          {isAuthenticated && userRole === "artisan" && (
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
          )}
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <span className="user-greeting">
                <span className="user-icon">👤</span>
                Hi, {user?.name || "User"}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link login-link">
                Login
              </Link>
              <Link to="/register" className="auth-link register-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
