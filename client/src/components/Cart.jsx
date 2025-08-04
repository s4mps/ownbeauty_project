import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingBag,
  FaArrowLeft,
  FaCreditCard,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Cart.module.css";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const calculateSubtotal = () => {
    return cart.reduce(
      (total, item) =>
        total + (item.current_price || item.price) * item.quantity,
      0
    );
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping();
    return subtotal + tax + shipping;
  };

  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      updateQuantity(cartItemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsCheckingOut(true);

    // Simulate checkout process
    setTimeout(() => {
      alert("Order placed successfully! Thank you for your purchase.");
      setIsCheckingOut(false);
      navigate("/");
    }, 2000);
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleContinueShopping}>
          <FaArrowLeft />
          Continue Shopping
        </button>
        <h1 className={styles.title}>
          <FaShoppingBag className={styles.titleIcon} />
          Shopping Cart
        </h1>
      </div>

      {cart.length === 0 ? (
        <motion.div
          className={styles.emptyCart}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaShoppingBag className={styles.emptyIcon} />
          <h2>Your cart is empty</h2>
          <p>Discover our amazing beauty products and start shopping!</p>
          <button
            className={styles.shopButton}
            onClick={handleContinueShopping}
          >
            Start Shopping
          </button>
        </motion.div>
      ) : (
        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={styles.cartItem}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className={styles.itemImage}>
                    <img
                      src={item.image_url || "/api/placeholder/80/80"}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = "/api/placeholder/80/80";
                      }}
                    />
                  </div>

                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <p className={styles.itemPrice}>
                      $
                      {typeof item.current_price === "number"
                        ? item.current_price.toFixed(2)
                        : (item.price || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className={styles.quantityControls}>
                    <button
                      className={styles.quantityButton}
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      disabled={loading}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      className={styles.quantityButton}
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>

                  <div className={styles.itemTotal}>
                    $
                    {(
                      (item.current_price || item.price) * item.quantity
                    ).toFixed(2)}
                  </div>

                  <button
                    className={styles.removeButton}
                    onClick={() => removeFromCart(item.id)}
                    disabled={loading}
                  >
                    X
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            className={styles.orderSummary}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal ({cart.length} items)</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>
                {calculateShipping() === 0 ? (
                  <span className={styles.freeShipping}>FREE</span>
                ) : (
                  `$${calculateShipping().toFixed(2)}`
                )}
              </span>
            </div>

            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
            </div>

            <div className={styles.summaryDivider}></div>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            <div className={styles.benefits}>
              <div className={styles.benefit}>
                <FaTruck className={styles.benefitIcon} />
                <span>Free shipping over $50</span>
              </div>
              <div className={styles.benefit}>
                <FaShieldAlt className={styles.benefitIcon} />
                <span>Secure checkout</span>
              </div>
              <div className={styles.benefit}>
                <FaCreditCard className={styles.benefitIcon} />
                <span>All payment methods accepted</span>
              </div>
            </div>

            <motion.button
              className={styles.checkoutButton}
              onClick={handleCheckout}
              disabled={isCheckingOut}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </motion.button>

            {!user && (
              <p className={styles.loginPrompt}>
                Please{" "}
                <button
                  className={styles.loginLink}
                  onClick={() => navigate("/login")}
                >
                  sign in
                </button>{" "}
                to continue with checkout
              </p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Cart;
