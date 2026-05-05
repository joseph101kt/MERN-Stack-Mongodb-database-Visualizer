import { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Generic controller to handle field updates and deletions 
 * for ANY collection in the database.
 */
export const updateCollectionField = async (req: Request, res: Response) => {
  try {
    const { collection, id } = req.params;
    const { path, value } = req.body;

    // TypeScript Check: Ensure params are strings
    if (typeof collection !== 'string' || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid collection or ID format' });
    }

    // 1. Get the Model dynamically (capitalize first letter to match Mongoose convention)
    const modelName = collection.charAt(0).toUpperCase() + collection.slice(1);
    
    // Check if the model exists in the current connection to prevent Mongoose error
    const Model = mongoose.models[modelName] || mongoose.model(modelName);

    if (!Model) {
      return res.status(404).json({ message: `Collection ${modelName} not found` });
    }

    // 2. Use MongoDB $set with bracket notation for nested paths (e.g., "metadata.color")
    const updateQuery = { $set: { [path]: value } };

    const updatedDoc = await Model.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({
      status: 'success',
      data: updatedDoc,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCollectionField = async (req: Request, res: Response) => {
  try {
    const { collection, id } = req.params;
    const { path } = req.body;

    // TypeScript Check: Ensure params are strings
    if (typeof collection !== 'string' || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid collection or ID format' });
    }

    const modelName = collection.charAt(0).toUpperCase() + collection.slice(1);
    const Model = mongoose.models[modelName] || mongoose.model(modelName);

    if (!Model) {
      return res.status(404).json({ message: `Collection ${modelName} not found` });
    }

    // 3. Use $unset to remove a specific key from the document
    const updateQuery = { $unset: { [path]: "" } };

    const updatedDoc = await Model.findByIdAndUpdate(id, updateQuery, { new: true });

    if (!updatedDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({
      status: 'success',
      data: updatedDoc,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};