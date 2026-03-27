import { Router } from 'express';
import { getMonProfil, modifierMonProfil, getAllUsers, toggleUserActif, deleteUser } from '../controllers/user.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Routes utilisateur connecté
router.get('/profil', authMiddleware, getMonProfil);
router.put('/profil', authMiddleware, modifierMonProfil);

// Routes admin
router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.patch('/:id/toggle', authMiddleware, adminMiddleware, toggleUserActif);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;