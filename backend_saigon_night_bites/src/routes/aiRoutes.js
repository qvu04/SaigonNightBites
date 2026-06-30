import { Router } from 'express';
import { recommend } from '../controllers/aiController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/recommend', authenticate, aiLimiter, recommend);

export default router;
