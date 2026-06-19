import express from 'express';
import {
  applyCoupon,
  createCheckoutSession,
  getMyOrders,
  getOrderById,
  stripeWebhook
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Webhook endpoint (should be called before body parsing middleware in server.js)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

router.post('/coupon', applyCoupon);
router.post('/checkout', protect, createCheckoutSession);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

export default router;
