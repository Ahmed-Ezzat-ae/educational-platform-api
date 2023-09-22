const fs = require('fs');

function deleteFolder(folderPath) {
  try {
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true });
    } else {
      return null;
    }
  } catch (err) {
    console.error(`Error deleting folder ${folderPath}: ${err}`);
    return err
  }
}

module.exports.deleteFolder = deleteFolder;
