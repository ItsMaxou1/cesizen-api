import { Router } from 'express';
import { addHistorique, getMonHistorique, deleteMonHistorique } from '../controllers/historique.controller';
import { authMiddleware } from '../middlewares/auth.middleware';


const router = Router();

router.post('/', authMiddleware, addHistorique);
router.get('/mon-historique', authMiddleware, getMonHistorique);
router.delete('/supprimer-tout', authMiddleware, deleteMonHistorique);

export default router;