import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ArtisanDashboard from "./pages/artisan/ArtisanDashboard";
import ArtisanProductsPage from "./pages/artisan/ArtisanProductsPage";
import ArtisanReportsPage from "./pages/artisan/ArtisanReportsPage";
import OrderAnalyticsPage from "./pages/artisan/OrderAnalyticsPage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route
              path="/cart"
              element={
                <RequireAuth>
                  <Cart />
                </RequireAuth>
              }
            />
            <Route
              path="/checkout"
              element={
                <RequireAuth>
                  <Checkout />
                </RequireAuth>
              }
            />
            <Route
              path="/orders"
              element={
                <RequireAuth>
                  <Orders />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Artisan routes */}
            <Route
              path="/artisan/dashboard"
              element={
                <RequireAuth allowedRoles={['artisan', 'admin']}>
                  <ArtisanDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/artisan/products"
              element={
                <RequireAuth allowedRoles={['artisan', 'admin']}>
                  <ArtisanProductsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/artisan/reports"
              element={
                <RequireAuth allowedRoles={['artisan', 'admin']}>
                  <ArtisanReportsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/artisan/orders"
              element={
                <RequireAuth allowedRoles={['artisan', 'admin']}>
                  <OrderAnalyticsPage />
                </RequireAuth>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
