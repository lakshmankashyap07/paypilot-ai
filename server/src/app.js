import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import merchantRoutes from './routes/merchantRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import growthCopilotRoutes from './routes/growthCopilotRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import personalizationRoutes from './routes/personalizationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import aiIntelligenceRoutes from './routes/aiIntelligenceRoutes.js';
import agenticCommerceRoutes from './routes/agenticCommerceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security HTTP headers with cross-origin resource policy allowed for static image uploads
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// Serve static uploaded product images directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Cross-Origin Resource Sharing configuration
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  })
);

// Cookie Parser Middleware
app.use(cookieParser());

// Rate limiting (skip rate limit in development for localhost / 127.0.0.1)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 500 : 10000,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== 'production' && (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1')
});
app.use('/api', limiter);

// Request payload parsing with rawBody capture for Razorpay webhook signature verification (Increased limit for image upload Base64 payloads)
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to PayPilot AI Backend API',
    track: 'Razorpay AI Builder Internship 2026 — Track 1: AI Growth & Agentic Commerce',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      aiShop: '/api/ai/chat',
      merchantAnalytics: '/api/merchant/analytics/overview',
      adminDashboard: '/api/admin/dashboard'
    }
  });
});

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/merchant/analytics', analyticsRoutes);
app.use('/api/merchant/campaigns', campaignRoutes);
app.use('/api/merchant/ai', growthCopilotRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/personalization', personalizationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ai-intelligence', aiIntelligenceRoutes);
app.use('/api/agentic', agenticCommerceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
