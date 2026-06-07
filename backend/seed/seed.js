const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../src/models/User');
const Task = require('../src/models/Task');
const data = require('./data.json');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    await User.deleteMany();
    await Task.deleteMany();
    console.log('Colecciones limpiadas');

    const usersCreated = [];

    for (const user of data.users) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      const newUser = await User.create({
        username: user.username,
        email: user.email,
        password: passwordHash
      });
      usersCreated.push(newUser);
      console.log(`Usuario creado: ${newUser.username}`);
    }

    for (const task of data.tasks) {
      const user = usersCreated.find(u => u.email === task.userEmail);
      await Task.create({
        title: task.title,
        completed: task.completed,
        user: user._id
      });
      console.log(`Tarea creada: ${task.title}`);
    }

    console.log('Seed completado');
    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
};

seed();