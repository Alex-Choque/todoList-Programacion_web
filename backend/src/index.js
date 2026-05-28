const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const taskRoutes = require('./routes/taskRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
const PORT = 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a mongo'))
  .catch((error) => console.error('Error al conectar mongo:', error));

app.use(express.json());

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache');
  next();
});

app.use('/tasks', taskRoutes);
app.use('/files', fileRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server running' });
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
