import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted || false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLike = () => {
    setIsWishlisted(!isWishlisted);
    // Here you could also call an API to update the wishlist
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsAdding(true);
    try {
      const result = await addToCart(product._id, 1);
      if (result.success) {
        // Show success message
        console.log("Product added to cart successfully");
      } else {
        console.error("Failed to add to cart:", result.error);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      className={styles.card}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.name} className={styles.image} />
        <div className={styles.rating}>
          <FaStar className={styles.starIcon} />
          <span>{product.rating}</span>
        </div>
      </div>
      <motion.div
        className={styles.info}
        initial={false}
        animate={isHovered ? { y: 0 } : { y: 20 }}
      >
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.priceContainer}>
          <span className={styles.price}>${product.price}</span>
        </div>
        <div className={styles.actions}>
          <motion.button
            className={styles.likeButton}
            onClick={handleLike}
            whileTap={{ scale: 0.9 }}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            title={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            {isWishlisted ? (
              <FaHeart className={styles.heartIcon} />
            ) : (
              <FaRegHeart />
            )}
          </motion.button>
          <motion.button
            className={styles.addToCartButton}
            onClick={handleAddToCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isAdding}
          >
            <FaShoppingCart className={styles.cartIcon} />
            {isAdding ? "Adding..." : "Add to Cart"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
