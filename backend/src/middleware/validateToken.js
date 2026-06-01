const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No hay token, acceso denegado' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  try {
    const decoded = jwt.verify(token,'secreto123');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token no válido o expirado' });
  }
};

module.exports = { validateToken };
