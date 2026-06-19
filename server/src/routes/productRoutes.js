import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getRecommendations,
  getCategories
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/recommendations', getRecommendations);
router.get('/categories', getCategories);
router.get('/:slug', getProductBySlug);

export default router;
