import express from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

router.get('/:slug', getProductBySlug);

router.route('/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;