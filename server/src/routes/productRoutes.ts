import express from 'express';
import { getProducts,createProduct, getProduct, updateProduct, deleteProduct,
  updateProductField, deleteProductField } from '../controllers/productController.js';

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

  // Path: /api/v1/products/:id/field
router.route('/:id/field')
  .patch(updateProductField)
  .delete(deleteProductField);

export default router;