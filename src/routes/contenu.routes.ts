import { Router } from 'express';
import { getAllContenus, getContenuById, createContenu, updateContenu, toggleContenuActif, deleteContenu } from '../controllers/contenu.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllContenus);
router.get('/:id', getContenuById);
router.post('/', authMiddleware, adminMiddleware, createContenu);
router.put('/:id', authMiddleware, adminMiddleware, updateContenu);
router.patch('/:id/toggle', authMiddleware, adminMiddleware, toggleContenuActif);
router.delete('/:id', authMiddleware, adminMiddleware, deleteContenu);

export default router;