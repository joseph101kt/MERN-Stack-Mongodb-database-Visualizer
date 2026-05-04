import { Request, Response } from 'express';
import Product from '../models/Products.js';
// import User from '../models/User.js'; // Future model

// @desc    Get all collections and their documents for the Visualizer
// @route   GET /api/v1/admin/collections
export const getCollectionsSummary = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all collections in parallel for performance
    const [products, users] = await Promise.all([
      Product.find().lean(),
      // User.find().lean() // Uncomment when User model exists
      Promise.resolve([]) // Placeholder for Users
    ]);

    const collections = [
      {
        name: 'Products',
        schema: 'Product',
        count: products.length,
        data: products
      },
      {
        name: 'Users',
        schema: 'User',
        count: users.length,
        data: users
      }
    ];

    res.status(200).json({
      success: true,
      data: collections
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error aggregating collections";
    res.status(500).json({ success: false, message });
  }
};