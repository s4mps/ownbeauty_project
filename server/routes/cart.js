const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

// All cart routes require authentication
router.use(authenticateToken);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:id', updateCartItem);
router.delete('/item/:id', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;