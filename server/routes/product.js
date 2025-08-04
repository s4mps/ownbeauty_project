const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  getProductById, 
  getCategories, 
  getFeaturedProducts, 
  getSaleProducts 
} = require('../controllers/productController');

// Public product routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/sale', getSaleProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

module.exports = router;
