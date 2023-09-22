const express = require('express');
const {
  createTeacher,
  loginTeacher,
  getAllTeachers,
  groupUploads,
  teacherProfile,
  updateProfile,
  resetPassword
} = require('../controllers/teachers');
const { protect } = require('../middlewares/auth');
const router = express.Router();

router.post('/register', createTeacher);
router.post('/login', loginTeacher);
router.get('/', getAllTeachers);
router.get('/uploads', protect, groupUploads);
router.get('/profile', protect, teacherProfile);
router.put('/profile', protect, updateProfile);
router.put('/reset-password', protect, resetPassword);

module.exports = router;
