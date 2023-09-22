const fs = require('fs');

function removeImagesBeforeAdd(filePath) {
  let fileContent = fs.readdirSync(filePath);
  let imageFiles = fileContent.filter(
    (file) => file.endsWith('.png') || file.endsWith('.jpg')
  );

  imageFiles.forEach((file) => {
    fs.unlinkSync(`${filePath}/${file}`);
  });
}

module.exports.deleteImages = removeImagesBeforeAdd;
