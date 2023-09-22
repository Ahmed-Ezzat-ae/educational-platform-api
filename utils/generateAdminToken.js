const jwt = require('jsonwebtoken');
const generateAdminToken = (data) => {
  return jwt.sign(
    {
      id: data._id,
      code: data.code,
      mainAdmin: data.mainAdmin,
    },
    process.env.SECRET_TOKEN,
    { expiresIn: '1d' }
  );
};

module.exports.generateAdminToken = generateAdminToken;
