import { Router } from 'express';
import { getAllCommentaires, getCommentairesByExercice, getCommentairesByContenu, createCommentaire, deleteCommentaire } from '../controllers/commentaire.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, adminMiddleware, getAllCommentaires)
router.get('/exercice/:id', getCommentairesByExercice);
router.get('/contenu/:id', getCommentairesByContenu);
router.post('/', authMiddleware, createCommentaire);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCommentaire);

export default router;