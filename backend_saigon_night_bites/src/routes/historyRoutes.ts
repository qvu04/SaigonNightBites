import { Router } from 'express';
import { getHistory } from '../controllers/historyController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', authenticate, getHistory);
export default router;
