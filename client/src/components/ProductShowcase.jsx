import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard.jsx";
import { productsAPI } from "../services/api";
import styles from "./ProductShowcase.module.css";

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "Skincare", "Makeup"];

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        limit: 12
      };
      
      if (activeCategory !== "all") {
        queryParams.category = activeCategory;
      }
      
      const response = await productsAPI.getAll();
      
      if (response.success) {
        setProducts(response.products || []);
      } else {
        throw new Error(response.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <section className={styles.productShowcase} id="products">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Our Products</h2>
          <p className={styles.subtitle}>
            Discover our curated collection of premium beauty products
          </p>
        </div>

        {/* Category Filter */}
        <div className={styles.filterBar}>
          <div className={styles.categories}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryBtn} ${
                  activeCategory === category ? styles.active : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category === "all" ? "All Products" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className={styles.productsContainer}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>Error loading products: {error}</p>
              <button onClick={fetchProducts} className={styles.retryBtn}>
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.noProducts}>
              <p>No products found in this category.</p>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    _id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    image: product.image_url || "/api/placeholder/300/300",
                    rating: product.rating || 4.0,
                    isWishlisted: false,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
