const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createAccessToken } = require('../libs/jwt');

const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    const userSaved = await newUser.save();
    const token = createAccessToken(userSaved._id);

    res.set('X-User-ID', userSaved._id.toString());
    res.set('Location', `/auth/user/${userSaved._id}`);
    res.set('X-Token-Expires', '1d');
    res.set('Cache-Control', 'no-store');

    res.status(201).json({
      message: 'Usuario registrado',
      token,
      user: {
        id: userSaved._id,
        username: userSaved.username,
        email: userSaved.email,
        createdAt: userSaved.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo registrar el usuario' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    
    if (!userFound) {
      return res.status(400).json({ error: 'Email no registrado' });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = createAccessToken(userFound._id);

    res.set('X-User-ID', userFound._id.toString());
    res.set('X-Token-Expires', '1d');
    res.set('Cache-Control', 'no-store');

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo iniciar sesión' });
  }
};

const logout = (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ message: 'Logout exitoso' });
};

module.exports = { register, login, logout };
