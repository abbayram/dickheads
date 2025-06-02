// routes/adminRoutes.js
import express from 'express';
import { loginAdmin } from '../controllers/adminController.js';

const router = express.Router();

// POST http://localhost:5001/api/admin/login
router.post('/login', loginAdmin);

export default router;