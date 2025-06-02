const express = require('express');
const router = express.Router();
const { 
  registerAdmin, 
  loginAdmin, 
  getAdminProfile 
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);

module.exports = router;
