import { Router } from 'express';
import { toggleLike, getLikesByExercice, getLikesByContenu } from '../controllers/like.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/toggle', authMiddleware, toggleLike);
router.get('/exercice/:id', getLikesByExercice);
router.get('/contenu/:id', getLikesByContenu);

export default router;