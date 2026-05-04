import { Request, Response } from 'express';
import Product from '../models/Products.js';
// @desc    Gets all product
// @route   GET /api/v1/products/
export const getProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    // Handling 'unknown' error type safely
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    
    res.status(500).json({ 
      success: false, 
      message 
    });
  }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error fetching product";
    res.status(400).json({ success: false, message });
  }
};

// @desc    Create new product
// @route   POST /api/v1/products
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error creating product";
    res.status(400).json({ success: false, message });
  }
};

// @desc    Update product
// @route   PATCH /api/v1/products/:id
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Check the model schema rules
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error updating product";
    res.status(400).json({ success: false, message });
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error deleting product";
    res.status(400).json({ success: false, message });
  }
};

// @desc    Update a specific field using dot notation
// @route   PATCH /api/v1/products/:id/field
export const updateProductField = async (req: Request, res: Response): Promise<void> => {
  try {
    const { path, value } = req.body;

    if (!path) {
      res.status(400).json({ success: false, message: 'Path is required' });
      return;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { [path]: value } }, // Uses dot notation to reach nested fields
      { new: true, runValidators: true }
    );

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error updating field";
    res.status(400).json({ success: false, message });
  }
};

// @desc    Remove a specific field using dot notation
// @route   DELETE /api/v1/products/:id/field
export const deleteProductField = async (req: Request, res: Response): Promise<void> => {
  try {
    const { path } = req.body;

    if (!path) {
      res.status(400).json({ success: false, message: 'Path is required' });
      return;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $unset: { [path]: "" } }, // Removes the field entirely
      { new: true }
    );

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error deleting field";
    res.status(400).json({ success: false, message });
  }
};

// @desc    Add a review to a product
// @route   POST /api/v1/products/:id/reviews
export const addProductReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rating, comment } = req.body;

    const newReview = {
      user: "Anonymous",
      rating: Number(rating) || 5,
      comment,
      date: new Date()
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $push: { reviews: newReview } },
      { returnDocument: 'after', runValidators: true }
    );

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(201).json({ success: true, data: product.reviews });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error adding review";
    res.status(400).json({ success: false, message });
  }
};