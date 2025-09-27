// routes/auth.js
import express from 'express';
import * as authCtrl from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', authCtrl.register);

// POST /api/auth/login
router.post('/login', authCtrl.login);

export default router;
