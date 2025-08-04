import React from "react";
import { motion } from "framer-motion";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles["hero-container"]}>
        <motion.div
          className={styles["hero-content"]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className={styles["hero-title"]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover Your
            <br />
            <span className="text-primary">Natural Beauty</span>
          </motion.h1>
          <motion.p
            className={styles["hero-text"]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience premium beauty products that enhance your unique glow.
            Our curated collection brings out the best in you, naturally and
            confidently.
          </motion.p>
          <motion.div
            className={styles["hero-buttons"]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href="#products"
              className={`${styles["hero-btn"]} ${styles.primary}`}
            >
              Explore Collection
            </a>
            <a
              href="#beauty-tips"
              className={`${styles["hero-btn"]} ${styles.secondary}`}
            >
              Beauty Tips
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles["hero-image-container"]}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className={styles["hero-image"]}>
            <img
              src="https://images-static.naikaa.com/beauty-blog/wp-content/uploads/2024/10/YUG-Banner.jpg"
              alt="Natural Beauty Products"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>

      <div className={styles["floating-elements"]}>
        <div
          className={`${styles["floating-element"]} ${styles["element-1"]}`}
        ></div>
        <div
          className={`${styles["floating-element"]} ${styles["element-2"]}`}
        ></div>
        <div
          className={`${styles["floating-element"]} ${styles["element-3"]}`}
        ></div>
      </div>
    </section>
  );
};

export default HeroSection;
