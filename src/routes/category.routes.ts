import express from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);

router.post('/', requireUsername, requireRole('Quiz Master'), CategoryController.createCategory);
router.put('/:id', requireUsername, requireRole('Quiz Master'), CategoryController.updateCategory);
router.delete('/:id', requireUsername, requireRole('Quiz Master'), CategoryController.deleteCategory);


export default router;