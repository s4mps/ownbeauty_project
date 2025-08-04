import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { cartAPI } from "../services/api";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      if (response.success && response.cart) {
        setCart(response.cart.items || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await cartAPI.addToCart(productId, quantity);
      if (response.success) {
        // Refresh cart data
        await fetchCart();
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Failed to add item to cart",
        };
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      setLoading(false);
      return {
        success: false,
        error: error.message || "Failed to add item to cart",
      };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      setLoading(true);
      const response = await cartAPI.updateCartItem(cartItemId, quantity);
      if (response.success) {
        // Refresh cart data
        await fetchCart();
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Failed to update quantity",
        };
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      setLoading(false);
      return {
        success: false,
        error: error.message || "Failed to update quantity",
      };
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);
      const response = await cartAPI.removeFromCart(cartItemId);
      if (response.success) {
        // Refresh cart data
        await fetchCart();
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Failed to remove item from cart",
        };
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
      setLoading(false);
      return {
        success: false,
        error: error.message || "Failed to remove item from cart",
      };
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.clearCart();
      if (response.success) {
        setCart([]);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Failed to clear cart",
        };
      }
    } catch (error) {
      console.error("Clear cart error:", error);
      return {
        success: false,
        error: error.message || "Failed to clear cart",
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
