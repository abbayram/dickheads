const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductBySlug, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

router.get('/:slug', getProductBySlug);

router.route('/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
