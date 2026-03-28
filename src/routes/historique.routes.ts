import { Router } from 'express';
import { addHistorique, getMonHistorique } from '../controllers/historique.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, addHistorique);
router.get('/mon-historique', authMiddleware, getMonHistorique);

export default router;