const crypto = require('crypto');

const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

const calculateDiscount = (originalPrice, salePrice) => {
  if (!salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `OB-${timestamp.slice(-6)}${random}`;
};

module.exports = {
  generateRandomString,
  formatPrice,
  calculateDiscount,
  validateEmail,
  sanitizeInput,
  generateOrderNumber
};
