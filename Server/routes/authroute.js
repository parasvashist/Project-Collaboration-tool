import express from 'express';
import { signup, login, getMe } from '../controllers/authController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, getMe); // ✅ New route for frontend dashboard

export default router;
