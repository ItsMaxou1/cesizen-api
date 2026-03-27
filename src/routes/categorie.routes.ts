import { Router } from 'express';
import { getAllCategories, getCategorieById, createCategorie, updateCategorie, deleteCategorie } from '../controllers/categorie.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllCategories);
router.get('/:id', getCategorieById);
router.post('/', authMiddleware, adminMiddleware, createCategorie);
router.put('/:id', authMiddleware, adminMiddleware, updateCategorie);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategorie);

export default router;