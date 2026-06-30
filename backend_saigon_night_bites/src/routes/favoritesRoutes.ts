import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoritesController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', authenticate, getFavorites);
router.post('/', authenticate, addFavorite);
router.delete('/:id', authenticate, removeFavorite);
export default router;
