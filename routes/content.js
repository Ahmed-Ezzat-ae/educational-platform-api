const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { uploadContent } = require('../middlewares/uploadContent');
const { uploadLogo, uploadDescImg, contentData} = require('../controllers/content/uploadLogo');

router.get("/", contentData)
router.post('/logo',  protect, uploadContent.single('logo'), uploadLogo);
router.post('/desc',  protect, uploadContent.single('descImg'), uploadDescImg);
module.exports = router;
