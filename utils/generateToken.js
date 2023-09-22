const jwt = require('jsonwebtoken');
const generateToken = (data) => {
  return jwt.sign(
    {
      id: data._id,
      code: data.code,
    },
    process.env.SECRET_TOKEN,
    { expiresIn: '1d' }
  );
};

module.exports.generateToken = generateToken;
