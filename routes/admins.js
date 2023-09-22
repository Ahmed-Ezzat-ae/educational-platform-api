const express = require('express');
const { getAdmins, adminProfile } = require('../controllers/admins/get');
const { createAdmin } = require('../controllers/admins/create');
const { updateAdmin, updateProfile } = require('../controllers/admins/update');
const { deleteAdmin } = require('../controllers/admins/delete');
const { loginAdmin } = require('../controllers/admins/login');
const {
  getTeachers,
  createTeacher,
  deleteTeacher,
} = require('../controllers/admins/teachers');

const { protect } = require('../middlewares/auth');
const { resetPassword } = require('../controllers/admins/reset-password');
const router = express.Router();

router.get('/', protect, getAdmins);
router.get('/profile', protect, adminProfile);

router.get('/teachers', protect, getTeachers);
router.post('/teachers/create', protect, createTeacher);
router.post('/login', loginAdmin);
router.post('/', protect, createAdmin);
router.put('/profile', protect, updateProfile);
router.put('/reset-password', protect, resetPassword);
router.put('/', protect, updateAdmin);
router.delete('/', protect, deleteAdmin);
router.delete('/teachers', protect, deleteTeacher);

module.exports = router;
