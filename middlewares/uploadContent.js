const multer = require('multer');
const path = require('path');
const createDirectoryIfNotExists = require('../utils/createFolders');
const { deleteImages } = require('../utils/deleteImages');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === 'image/png') {
      deleteImages(path.resolve(__dirname, '../', 'assets', 'images', 'logo'));
      cb(
        null,
        createDirectoryIfNotExists(
          path.resolve(__dirname, '../', 'assets', 'images', 'logo')
        )
      );
    }
    if (file.mimetype === 'image/jpeg') {
      deleteImages(
        path.resolve(__dirname, '../', 'assets', 'images', 'content')
      );
      cb(
        null,
        createDirectoryIfNotExists(
          path.resolve(__dirname, '../', 'assets', 'images', 'content')
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

module.exports.uploadContent = upload;
