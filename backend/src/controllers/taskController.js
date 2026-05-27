const Task = require('../models/Task');

const generateETag = (task) => `"${task._id}-${task.updatedAt.getTime()}"`;

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    const lastModified = tasks.reduce(
      (max, t) => (t.updatedAt > max ? t.updatedAt : max),
      new Date(0)
    );

    const etag = `"${tasks.length}-${lastModified.getTime()}"`;

    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end();
    }

    res.set('X-Total-Count', tasks.length);
    res.set('X-Resource', 'tasks');
    res.set('Last-Modified', lastModified.toUTCString());
    res.set('ETag', etag);
    res.set('Cache-Control', 'no-cache');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener las tareas' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const etag = generateETag(task);

    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end();
    }

    res.set('ETag', etag);
    res.set('X-Task-ID', task._id.toString());
    res.set('X-Completed', task.completed.toString());
    res.set('Cache-Control', 'no-cache');

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener la tarea' });
  }
};

const createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const result = await newTask.save();
    
    res.set('X-Task-ID', result._id.toString());
    res.set('Location', `/tasks/${result._id}`);
    res.set('Cache-Control', 'no-store');

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear la tarea' });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const etag = generateETag(updatedTask);

    res.set('ETag', etag);
    res.set('Cache-Control', 'no-cache');

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo actualizar la tarea' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.set('X-Deleted-ID', deletedTask._id.toString());
    res.set('X-Deleted-Title', deletedTask.title);
    res.set('Cache-Control', 'no-store');

    res.json({ 
      message: 'Tarea eliminada correctamente',
      deleted: deletedTask
    });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar la tarea' });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
