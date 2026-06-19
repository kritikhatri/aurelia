import express from 'express';
import {
  getCommunityPosts,
  createCommunityPost,
  likeCommunityPost,
  addCommentToPost,
  flagCommunityPost
} from '../controllers/communityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCommunityPosts);
router.post('/', protect, createCommunityPost);
router.put('/:id/like', protect, likeCommunityPost);
router.post('/:id/comment', protect, addCommentToPost);
router.put('/:id/flag', protect, flagCommunityPost);

export default router;
