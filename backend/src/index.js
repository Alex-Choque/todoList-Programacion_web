const express = require('express');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
require('dotenv').config();
const taskRoutes = require('./routes/taskRoutes');
const fileRoutes = require('./routes/fileRoutes');
const authRoutes = require('./routes/authRoutes');
const { validateToken } = require('./middleware/validateToken');

const app = express();
const PORT = process.env.PORT || 5000;

const credentials = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a mongo'))
  .catch((error) => console.error('Error al conectar mongo:', error));

app.use(express.json());

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache');
  next();
});

app.use('/tasks', validateToken, taskRoutes);
app.use('/files', validateToken, fileRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server running' });
});

https.createServer(credentials, app).listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});