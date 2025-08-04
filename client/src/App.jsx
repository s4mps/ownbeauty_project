import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/Navbar.jsx";
import HeroSection from "./components/HeroSection.jsx";
import ProductShowcase from "./components/ProductShowcase.jsx";
import BeautyTips from "./components/BeautyTips.jsx";
import Gallery from "./components/Gallery.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./components/Login.jsx";
import Cart from "./components/Cart.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import "./App.css";

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isAdminPage = location.pathname === "/admin";

  return (
    <div className="app">
      {!isLoginPage && !isAdminPage && <Navbar />}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <ProductShowcase />
                <BeautyTips />
                <Gallery />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isLoginPage && !isAdminPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
