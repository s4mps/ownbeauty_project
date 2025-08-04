const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
};

const PRODUCT_CATEGORIES = {
  LIPSTICK: 'lipstick',
  FOUNDATION: 'foundation',
  EYESHADOW: 'eyeshadow',
  MASCARA: 'mascara',
  BLUSH: 'blush',
  CONCEALER: 'concealer',
  BRONZER: 'bronzer',
  HIGHLIGHTER: 'highlighter'
};

const API_MESSAGES = {
  SUCCESS: {
    REGISTERED: 'User registered successfully',
    LOGGED_IN: 'Login successful',
    PROFILE_UPDATED: 'Profile updated successfully',
    PRODUCT_ADDED: 'Product added successfully',
    CART_UPDATED: 'Cart updated successfully',
    ORDER_CREATED: 'Order created successfully'
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_EXISTS: 'User already exists',
    PRODUCT_NOT_FOUND: 'Product not found',
    INSUFFICIENT_STOCK: 'Insufficient stock',
    UNAUTHORIZED: 'Unauthorized access',
    INTERNAL_ERROR: 'Internal server error'
  }
};

module.exports = {
  ORDER_STATUS,
  USER_ROLES,
  PRODUCT_CATEGORIES,
  API_MESSAGES
};
