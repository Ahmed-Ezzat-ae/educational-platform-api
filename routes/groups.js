const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');

const {
  createGroupe,
  groupDetails,
  getGroupeLevelOne,
  getGroupeLevelTwo,
  getGroupeLevelThree,
  deleteGroupLevelOne,
  deleteGroupLevelTwo,
  deleteGroupLevelThree,
  properStudentGroups,
  joinToGroup,
} = require('../controllers/groups');

// const { leaveGroup } = require('../controllers/groups/leaveGroup');
const {
  deleteAllStudents,
} = require('../controllers/groups/deleteAllStudents');
const {
  deleteStudentFromGroup,
} = require('../controllers/groups/deleteStudent');
const { updateAbsence } = require('../controllers/groups/absence');
const { updateGroupData } = require('../controllers/groups/update');
const { upload } = require('../middlewares/upload');
const { uploadFiles } = require('../controllers/uploads/uploadFiles');
const {
  getGroupEContent,
  downloadGroupEContent,
} = require('../controllers/groups/getEContent');
const {
  deleteUploadFile,
  deleteUploadLesson,
} = require('../controllers/uploads/deleteFile');
const {
  moveStudentToGroup,
  getAvailableGroups,
} = require('../controllers/groups/moveStudent');

/* student actions  */
router.post('/join/:id', protect, joinToGroup);
// router.put('/leave-group', protect, leaveGroup);
router.get('/details/:id', protect, groupDetails);
router.get('/group-e-content', protect, getGroupEContent);
router.get('/download-e-content', downloadGroupEContent);
// router.get("/download-e-content", protect, downloadGroupEContent);

/* teacher  actions */

router.get('/students', protect, properStudentGroups);
router.get('/levelOne', protect, getGroupeLevelOne);
router.get('/levelTwo', protect, getGroupeLevelTwo);
router.get('/levelThree', protect, getGroupeLevelThree);
router.get('/available', protect, getAvailableGroups);
router.post('/', protect, createGroupe);
router.post('/uploads', protect, upload.single('file'), uploadFiles);
router.put('/absence', protect, updateAbsence);
router.put('/update', protect, updateGroupData);
router.put('/moveStudent', protect, moveStudentToGroup);
router.delete('/levelOne', protect, deleteGroupLevelOne);
router.delete('/levelTwo', protect, deleteGroupLevelTwo);
router.delete('/levelThree', protect, deleteGroupLevelThree);
router.delete('/students', protect, deleteAllStudents);
router.delete('/student', protect, deleteStudentFromGroup);
router.delete('/uploadsFile', protect, deleteUploadFile);
router.delete('/uploadLesson', protect, deleteUploadLesson);

module.exports = router;
