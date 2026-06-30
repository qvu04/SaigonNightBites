import { Router } from 'express';
import { searchPlaces } from '../controllers/placesController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { placesLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/search', authenticate, placesLimiter, searchPlaces);

export default router;
