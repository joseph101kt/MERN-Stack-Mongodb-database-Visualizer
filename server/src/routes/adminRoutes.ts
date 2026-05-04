import express from 'express';
import { getCollectionsSummary } from '../controllers/adminController.js';

const router = express.Router();

// This single route powers your entire Visualizer Frame
router.get('/collections', getCollectionsSummary);

export default router;