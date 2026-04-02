import { Router } from 'express';
import { getAllExercices, getExerciceById, createExercice, updateExercice, toggleExerciceActif, deleteExercice } from '../controllers/exercice.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllExercices);
router.get('/:id', getExerciceById);
router.post('/', authMiddleware, adminMiddleware, createExercice);
router.put('/:id', authMiddleware, adminMiddleware, updateExercice);
router.patch('/:id/toggle', authMiddleware, adminMiddleware, toggleExerciceActif);
router.delete('/:id', authMiddleware, adminMiddleware, deleteExercice);

export default router;