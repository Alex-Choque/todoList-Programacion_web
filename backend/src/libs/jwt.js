const jwt = require('jsonwebtoken');

const createAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

module.exports = { createAccessToken };
