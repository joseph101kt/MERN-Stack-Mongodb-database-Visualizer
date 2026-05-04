import express from 'express';
import { getProducts,createProduct, getProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

// Path: /api/v1/products
router.route('/')
  .get(getProducts)
  .post(createProduct);

// Path: /api/v1/products/:id
router.route('/:id')
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

export default router;