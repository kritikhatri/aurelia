import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';

// Import Middlewares
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import routineRoutes from './routes/routineRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false // Allows serving local static files to client
}));

// CORS setup
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
}));

// Cookie Parser
app.use(cookieParser());

// Rate Limiter
app.use('/api', apiLimiter);

// Note: Stripe Webhook needs raw body, we process it in orderRoutes directly,
// but for all other API endpoints we parse JSON.
app.use((req, res, next) => {
  if (req.originalUrl === '/api/orders/webhook') {
    next();
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for uploaded files
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Test Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Aurelia Luxury Beauty API' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
