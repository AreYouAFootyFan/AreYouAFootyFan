import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/google-login', AuthController.googleLogin);
router.get('/username-status', authenticate, AuthController.checkUsernameStatus);

export default router;