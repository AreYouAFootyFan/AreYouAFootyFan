import express from 'express';
import { UserResponseController } from '../controllers/user-response.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);
router.use(requireUsername);
router.use(requireRole('Player'));

router.get('/attempt/:attemptId', UserResponseController.getAttemptResponses);
router.get('/:id', UserResponseController.getResponseById);
router.post('/submit', UserResponseController.submitResponse);

export default router;