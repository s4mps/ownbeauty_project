import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFaceSmileBeam,
  FaWandMagicSparkles,
  FaSprayCan,
} from "react-icons/fa6";
import "./BeautyTips.css";

const BeautyTips = () => {
  const [activeCategory, setActiveCategory] = useState("skincare");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = {
    skincare: {
      icon: FaFaceSmileBeam,
      tips: [
        {
          id: 1,
          tip: "Double Cleansing Ritual",
          description:
            "Start with an oil-based cleanser followed by a water-based one for perfectly clean skin.",
          image: "https://example.com/images/double-cleansing.jpg",
        },
        {
          id: 2,
          tip: "Layered Hydration",
          description:
            "Apply products from thinnest to thickest - toner, essence, serum, moisturizer, oil.",
          image: "https://example.com/images/hydration.jpg",
        },
        {
          id: 3,
          tip: "Sun Protection",
          description:
            "Use broad-spectrum SPF 30+ daily, even on cloudy days or indoors.",
          image: "https://example.com/images/suncare.jpg",
        },
      ],
    },
    makeup: {
      icon: FaWandMagicSparkles,
      tips: [
        {
          id: 1,
          tip: "Professional Color Correction",
          description:
            "Green neutralizes redness, purple brightens sallowness, peach conceals dark circles.",
          image: "https://example.com/images/color-correction.jpg",
        },
        {
          id: 2,
          tip: "Eye Makeup Architecture",
          description:
            "Map out your eye shapes first - crease, outer v, and lid space for perfect eyeshadow application.",
          image: "https://example.com/images/eye-makeup.jpg",
        },
        {
          id: 3,
          tip: "Long-Lasting Base",
          description:
            "Layer thin coats of primer, foundation, and setting spray for 24-hour wear.",
          image: "https://example.com/images/base-makeup.jpg",
        },
      ],
    },
    haircare: {
      icon: FaSprayCan,
      tips: [
        {
          id: 1,
          tip: "Silk Pillowcase Benefits",
          description:
            "Switch to silk pillowcases to prevent friction damage and maintain hair moisture.",
          image: "https://example.com/images/silk-pillow.jpg",
        },
        {
          id: 2,
          tip: "Pre-Shampoo Treatment",
          description:
            "Apply hair oil 30 minutes before washing to protect strands from harsh surfactants.",
          image: "https://example.com/images/hair-oil.jpg",
        },
        {
          id: 3,
          tip: "Heat Styling Protection",
          description:
            "Layer heat protectant products and never exceed 365°F/185°C on tools.",
          image: "https://example.com/images/heat-protection.jpg",
        },
      ],
    },
  };

  return (
    <motion.section
      id="beauty-tips"
      className="beauty-tips-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Beauty Secrets & Expert Tips
        </motion.h2>

        <div className="category-nav">
          {Object.entries(categories).map(([category, { icon: Icon }]) => (
            <motion.button
              key={category}
              className={`category-btn ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="category-icon" />
              <span>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="tips-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="tips-grid"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {categories[activeCategory].tips.map((tip) => (
                <motion.div
                  key={tip.id}
                  className="tip-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: tip.id * 0.1 }}
                >
                  <div className="tip-card-content">
                    <h3>{tip.tip}</h3>
                    <p>{tip.description}</p>
                  </div>
                  <div
                    className="tip-image"
                    style={{ backgroundImage: `url(${tip.image})` }}
                  />
                  <motion.div
                    className="tip-overlay"
                    whileHover={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="tip-details">{tip.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};
export default BeautyTips;
