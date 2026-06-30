import { Router } from 'express';
import { testKeys } from '../controllers/testController.js';

const router = Router();

// Dev-only: no auth required
router.get('/keys', testKeys);

export default router;
