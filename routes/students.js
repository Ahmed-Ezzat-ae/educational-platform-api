const express = require('express');
const {
  createStudent,
  loginStudent,
  studentProfile,
  updateProfile,
  resetPassword,
} = require('../controllers/students');
const router = express.Router();
const { protect } =  require('../middlewares/auth');

router.post('/register', createStudent);
router.post('/login', loginStudent);
router.get('/profile', protect, studentProfile);
router.put('/profile', protect, updateProfile);
router.put('/reset-password', protect, resetPassword);

module.exports = router;
