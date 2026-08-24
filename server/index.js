// env.js MUST be the first import — it loads server/.env before any other module
// evaluates process.env at module load time (ESM hoists all imports together,
// but dependency graph evaluation order ensures env.js runs before app modules)
import './env.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import { initDatabaseConnection, disconnectDatabase } from './config/prisma.js';
import giftRoutes from './routes/giftRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Basic Security Headers Middleware
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Production-ready CORS Configuration
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, webhooks, server-to-server)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.netlify.app') ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.ngrok-free.app')
    ) {
      return callback(null, true);
    }
    // In development mode, allow any origin
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy: Origin not allowed.'));
  },
  credentials: true
}));

// JSON middleware preserving exact raw body buffer for Razorpay webhook signature verification
app.use(express.json({
  limit: '15mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads serving for local dev/fallbacks
app.use('/uploads', express.static(uploadsDir));

// Production Health Endpoints (Root /health for Render/AWS + /api/health)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Rakhi Gift Backend API',
    database: 'PostgreSQL (Prisma ORM)',
    payments: 'Razorpay Webhook-Enabled',
    version: '2.3.0',
    environment: process.env.NODE_ENV || 'development'
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// API Routes
app.use('/api/gifts', giftRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Global 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `API endpoint ${req.originalUrl} not found.`
    }
  });
});

// Global Error Handling Middleware (Sanitized for Production)
app.use((err, req, res, next) => {
  console.error('[Error] Unhandled server error:', err.message || err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred on the server.'
        : (err.message || 'Internal server error')
    }
  });
});

// Start Server & Connect Database
const server = app.listen(PORT, async () => {
  console.log(`🎁 Rakhi Gift Backend API running on http://localhost:${PORT}`);
  console.log(`🔒 Health check available at http://localhost:${PORT}/health & /api/health`);
  await initDatabaseConnection();
});

// Graceful Shutdown Handling
const handleShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    await disconnectDatabase();
    console.log('Database disconnected. Exiting process.');
    process.exit(0);
  });

  // Force close after 10 seconds if hanging
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export default app;
