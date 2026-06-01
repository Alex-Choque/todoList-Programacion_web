const jwt = require('jsonwebtoken');

const createAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    'secreto123',
    { expiresIn: '1d' }
  );
};

module.exports = { createAccessToken };
