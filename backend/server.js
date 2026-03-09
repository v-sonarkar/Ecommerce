import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userroutes.js';
import productRouter from './routes/productroutes.js';
import cartRouter from './routes/cartroutes.js';
import orderRouter from './routes/orderroutes.js';



dotenv.config();


const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Request logger to diagnose routing issues
app.use((req, _res, next) => {
  console.log(`[srv] ${req.method} ${req.originalUrl}`);
  next();
});


// Database connection
await connectDB();

// Cloudinary connection
await connectCloudinary();

//api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter);


// Sample route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', path: req.originalUrl, method: req.method });
});


// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Prevent process from exiting unexpectedly
process.on('uncaughtException', (error) => {
  console.error('[Fatal] Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Fatal] Unhandled rejection at:', promise, 'reason:', reason);
});