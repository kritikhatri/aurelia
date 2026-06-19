import express from 'express';
import {
  getDashboardAnalytics,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
  getCustomers,
  getCoupons,
  createCoupon,
  deleteCoupon,
  getFlaggedPosts,
  moderatePost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect);
router.use(adminOnly);

router.get('/analytics', getDashboardAnalytics);

router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.get('/customers', getCustomers);

router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);

router.get('/flagged-posts', getFlaggedPosts);
router.put('/flagged-posts/:id/moderate', moderatePost);

router.post('/blogs', createBlogPost);
router.put('/blogs/:id', updateBlogPost);
router.delete('/blogs/:id', deleteBlogPost);

export default router;
