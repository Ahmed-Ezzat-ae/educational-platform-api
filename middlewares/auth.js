const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  let decodedData;
  try {
    if (token) {
      decodedData = jwt.verify(token, process.env.SECRET_TOKEN);
      if (
        (decodedData.code.startsWith('Mr.') ||
          decodedData.code.startsWith('Mrs.')) &&
        decodedData.code.length === 12
      ) {
        req.teacherId = decodedData.id;
        req.teacherCode = decodedData.code;
      } else if (
        decodedData.code.startsWith('S') &&
        decodedData.code.length === 10
      ) {
        req.studentId = decodedData.id;
        req.studentCode = decodedData.code;
      } else if (
        decodedData.code.startsWith('Admin.') &&
        decodedData.code.length === 15
      ) {
        req.adminAuth = {
          code: decodedData.code,
          id: decodedData.id,
          mainAdmin: decodedData.mainAdmin,
        };
      } else {
        return res.status(401).json({ message: 'مستخدم غير موثوق' });
      }
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'مستخدم غير موثوق' });
  }
};

module.exports.protect = protect;
