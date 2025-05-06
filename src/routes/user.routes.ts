import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/me', authenticate, UserController.getCurrentUser);
router.put('/username', authenticate, UserController.setUsername);

router.get('/:id', authenticate, requireUsername, requireRole('Quiz Master'), UserController.getUserById);
router.put('/:id', authenticate, requireUsername, requireRole('Quiz Master'), UserController.updateUser);
router.delete('/:id', authenticate, requireUsername, requireRole('Quiz Master'), UserController.deactivateUser);

export default router;