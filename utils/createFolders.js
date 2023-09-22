const fs = require('fs');

function createDirectoryIfNotExists(directoryPath) {
  try {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    return directoryPath;
  } catch (error) {
    throw new Error(`خطأ عند انشاء الملفات: ${error.message}`);
  }
}

module.exports = createDirectoryIfNotExists;
