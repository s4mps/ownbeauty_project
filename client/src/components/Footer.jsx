import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiYoutube,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
} from "react-icons/fi";
import styles from "./Footer.module.css";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  const quickLinks = [
    { text: "Home", href: "#home" },
    { text: "Products", href: "#products" },
    { text: "Beauty Tips", href: "#beauty-tips" },
    { text: "Gallery", href: "#gallery" },
    { text: "Contact", href: "#contact" },
  ];

  const serviceLinks = [
    { text: "Makeup", href: "/services/makeup" },
    { text: "Skincare", href: "/services/skincare" },
    { text: "Hair Care", href: "/services/hair" },
    { text: "Nail Care", href: "/services/nails" },
    { text: "Beauty Courses", href: "/courses" },
  ];

  const contactInfo = [
    { icon: <FiMapPin />, text: "baneshwor, Kathmandiu" },
    { icon: <FiPhone />, text: "+977 97XXXXXXX" },
    { icon: <FiMail />, text: "sampana@gmail.com" },
    { icon: <FiClock />, text: "Sun - Fri: 9:00 AM - 8:00 PM" },
  ];

  const socialLinks = [
    { icon: <FiInstagram />, href: "https://instagram.com" },
    { icon: <FiFacebook />, href: "https://facebook.com" },
    { icon: <FiTwitter />, href: "https://twitter.com" },
    { icon: <FiYoutube />, href: "https://youtube.com" },
  ];

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Brand Column */}
          <div className={styles.footerColumn}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className={styles.logo}>Own Beauty</h2>
              <p className={styles.description}>
                Discover your true beauty with our premium beauty products and
                expert services. Transform your beauty routine with Own Beauty.
              </p>
              <div className={styles.socialList}>
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links Column */}
          <div className={styles.footerColumn}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className={styles.title}>Quick Links</h3>
              <div className={styles.linkList}>
                {quickLinks.map((link, index) => (
                  <a key={index} href={link.href} className={styles.link}>
                    {link.text}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Services Column */}
          <div className={styles.footerColumn}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className={styles.title}>Our Services</h3>
              <div className={styles.linkList}>
                {serviceLinks.map((link, index) => (
                  <a key={index} href={link.href} className={styles.link}>
                    {link.text}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact & Newsletter Column */}
          <div className={styles.footerColumn}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className={styles.title}>Contact Us</h3>
              <div className={styles.linkList}>
                {contactInfo.map((info, index) => (
                  <div key={index} className={styles.link}>
                    {info.icon}
                    <span>{info.text}</span>
                  </div>
                ))}
              </div>
              <h3 className={styles.title} style={{ marginTop: "1.5rem" }}>
                Newsletter
              </h3>
              <form onSubmit={handleSubmit} className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
                <motion.button
                  type="submit"
                  className={styles.submitButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Own Beauty. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <a href="/privacy" className={styles.bottomLink}>
              Privacy Policy
            </a>
            <a href="/terms" className={styles.bottomLink}>
              Terms of Service
            </a>
            <a href="/shipping" className={styles.bottomLink}>
              Shipping Info
            </a>
            <a href="/faq" className={styles.bottomLink}>
              FAQ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;