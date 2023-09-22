const multer = require('multer');
const path = require('path');
const createDirectoryIfNotExists = require('../utils/createFolders');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === 'video/mp4') {
      cb(
        null,
        createDirectoryIfNotExists(
          path.resolve(__dirname, '../', 'public', req.teacherId, 'videos')
        )
      );
    } else if (file.mimetype === 'application/pdf') {
      cb(
        null,
        createDirectoryIfNotExists(
          path.resolve(__dirname, '../', 'public', req.teacherId, 'pdfs')
        )
      );
    } else {
      return null;
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      path.parse(file.originalname.replaceAll(' ', '-')).name +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

module.exports.upload = upload;
