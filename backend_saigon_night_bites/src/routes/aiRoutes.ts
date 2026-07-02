import { Router } from 'express';
import { recommend, getInsights } from '../controllers/aiController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();
router.post('/recommend', authenticate, aiLimiter, recommend);
router.post('/insights', authenticate, aiLimiter, getInsights);
export default router;
