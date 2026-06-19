import express from 'express';
import { getMyRoutines, updateRoutine } from '../controllers/routineController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getMyRoutines);
router.post('/', protect, updateRoutine);

export default router;
