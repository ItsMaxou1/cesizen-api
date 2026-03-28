import { Router } from 'express';
import { toggleFavori, getMesFavoris } from '../controllers/favori.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/toggle', authMiddleware, toggleFavori);
router.get('/mes-favoris', authMiddleware, getMesFavoris);

export default router;