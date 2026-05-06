import dotenv from 'dotenv';
// 1. Load variables before anything else
dotenv.config(); 

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// 2. Connect to Database
connectDB();

// 3. Middleware
app.use(express.json());

// Updated CORS: Allows local dev and your future deployed frontend
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite default
    'http://localhost:3000', // React default
    /\.netlify\.app$/,       // Allows any Netlify preview/subdomain
    /\.vercel\.app$/         // Allows any Vercel preview/subdomain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT']
}));

app.use(helmet());
app.use(morgan('dev'));

// 4. Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health Check Route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'success',
    message: 'API is running...',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 5. Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

// Listening on 0.0.0.0 is best practice for cloud providers like Render
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});