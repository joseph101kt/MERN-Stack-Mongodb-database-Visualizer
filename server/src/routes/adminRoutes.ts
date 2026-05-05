import express from 'express';
import { getCollectionsSummary } from '../controllers/adminController.js';
import { updateCollectionField } from '../controllers/collectionController.js';
import { deleteCollectionField } from '../controllers/collectionController.js';
const router = express.Router();

// This single route powers your entire Visualizer Frame
router.get('/collections', getCollectionsSummary);


router.patch('/:collection/:id/field', updateCollectionField);
router.delete('/:collection/:id/field', deleteCollectionField);

export default router;