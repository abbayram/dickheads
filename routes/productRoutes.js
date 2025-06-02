import express from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');  // Stellen Sie sicher, dass dieser Ordner existiert
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });


const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, upload.array('images', 5), createProduct);

router.get('/:slug', getProductBySlug);

router.route('/:id')
  .put(protect, upload.array('images', 5), updateProduct)
  .delete(protect, deleteProduct);

export default router;