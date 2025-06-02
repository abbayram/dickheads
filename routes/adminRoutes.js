// routes/adminRoutes.js
import express from 'express';
import { registerAdmin, loginAdmin } from '../controllers/adminController.js';
//import { authMiddleware } from '../middleware/authMiddleware.js'; // falls du Auth schon ausgelagert hast

const router = express.Router();

// @desc    Admin-Registrierung
// @route   POST /api/admin/register
// @access  Public
router.post('/register', registerAdmin);

// @desc    Admin-Login
// @route   POST /api/admin/login
// @access  Public
router.post('/login', loginAdmin);

// Falls du aktuell keine Profil‐Route brauchst, entferne einfach die Zeile mit getAdminProfile:
// // @desc    Admin-Profil
// // @route   GET /api/admin/profile
// // @access  Private
// router.get('/profile', authMiddleware, getAdminProfile);

export default router;