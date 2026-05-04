import dotenv from 'dotenv';
// 1. Load variables before anything else
dotenv.config(); 

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';

const app = express();

// 2. Connect to Database
connectDB();

// 3. Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// 4. Routes
app.use('/api/v1/products', productRoutes);

// Health Check Route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'success',
    message: 'API is running...',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 5. Global Error Handler (Catch-all for typos/errors)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});