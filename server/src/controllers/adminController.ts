import { Request, Response } from 'express';
import mongoose from 'mongoose';

// @desc    Get all ACTUAL collections from the DB dynamically
// @route   GET /api/v1/admin/collections
export const getCollectionsSummary = async (_req: Request, res: Response): Promise<void> => {
  try {
    // 1. Get the native MongoDB database object
    const db = mongoose.connection.db;
    
    if (!db) {
      res.status(500).json({ success: false, message: "Database connection not established" });
      return;
    }

    // 2. List all collections in the current database
    const collectionsList = await db.listCollections().toArray();

    // 3. Map through each collection to get counts and data
    const collectionsData = await Promise.all(
      collectionsList.map(async (col) => {
        const name = col.name;
        
        // Fetch document count and the documents themselves
        const count = await db.collection(name).countDocuments();
        const data = await db.collection(name).find().toArray();

        return {
          name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize (e.g. products -> Products)
          schema: name.charAt(0).toUpperCase() + name.slice(1).replace(/s$/, ''), // Singular (e.g. Products -> Product)
          count,
          data
        };
      })
    );

    res.status(200).json({
      success: true,
      data: collectionsData
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error aggregating collections";
    res.status(500).json({ success: false, message });
  }
};