const express = require('express');
const router = express.Router();
const { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  checkWishlistStatus 
} = require('../controllers/wishlistController');
const { authenticateToken } = require('../middleware/auth');

// All wishlist routes require authentication
router.use(authenticateToken);

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/remove/:product_id', removeFromWishlist);
router.get('/check/:product_id', checkWishlistStatus);

module.exports = router;
