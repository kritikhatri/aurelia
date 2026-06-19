import express from 'express';
import {
  getMySubscription,
  createOrUpdateSubscription,
  cancelSubscription
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getMySubscription);
router.post('/', protect, createOrUpdateSubscription);
router.put('/cancel', protect, cancelSubscription);

export default router;
