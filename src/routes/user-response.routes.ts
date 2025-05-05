import express from 'express';
import { UserResponseController } from '../controllers/user-response.controller';

const router = express.Router();

router.get('/attempt/:attemptId', UserResponseController.getAttemptResponses);

router.get('/:id', UserResponseController.getResponseById);

router.post('/submit', UserResponseController.submitResponse);

export default router;