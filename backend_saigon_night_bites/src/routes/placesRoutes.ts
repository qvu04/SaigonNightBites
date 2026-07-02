import { Router } from 'express';
import { searchPlaces } from '../controllers/placesController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { placesLimiter, aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();
// aiLimiter dùng chung với /api/ai/recommend vì searchPlaces cũng gọi Groq để rerank kết quả
router.get('/search', authenticate, placesLimiter, aiLimiter, searchPlaces);
export default router;
