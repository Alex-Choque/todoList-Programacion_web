const express = require('express');
const { login, register, logout, profile } = require('../controllers/authController');
const {validateToken} = require('../middleware/validateToken');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', validateToken, profile);

module.exports = router;