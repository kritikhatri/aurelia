import express from 'express';
import { getBlogPosts, getBlogPostBySlug } from '../controllers/blogController.js';

const router = express.Router();

router.get('/', getBlogPosts);
router.get('/:slug', getBlogPostBySlug);

export default router;
