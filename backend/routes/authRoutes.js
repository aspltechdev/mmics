import express from 'express';
import { login, getMe, register, changePassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', authLimiter, login);
router.get('/me', authenticate, getMe);
router.post('/register', authenticate, register);
router.post('/change-password', authenticate, changePassword);

export default router;