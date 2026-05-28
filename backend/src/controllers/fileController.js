const fs = require('fs');
const path = require('path');

const uploads = 'uploads/';

const getFiles = (req, res) => {
  try {
    const files = fs.readdirSync(uploads);

    res.set('X-Total-Count', files.length);
    res.set('X-Resource', 'files');
    res.set('Cache-Control', 'no-cache');

    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener la lista' });
  }
};

const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Falta el archivo' });
    }

    res.set('X-File-Name', req.file.originalname);
    res.set('X-File-Size', req.file.size.toString());
    res.set('X-File-Type', req.file.mimetype);
    res.set('Location', `/files/download/${req.file.originalname}`);
    res.set('Cache-Control', 'no-store');

    res.status(201).json({
      message: 'Archivo guardado',
      file: req.file.originalname
    });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo subir el archivo' });
  }
};

const downloadFile = (req, res) => {
  try {
    const filePath = path.join(uploads, req.params.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    const stats = fs.statSync(filePath);

    res.set('X-File-Name', req.params.filename);
    res.set('Content-Length', stats.size.toString());
    res.set('Last-Modified', stats.mtime.toUTCString());
    res.set('Cache-Control', 'public, max-age=3600');

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo descargar el archivo' });
  }
};

const deleteFile = (req, res) => {
  try {
    const filePath = path.join(uploads, req.params.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    fs.unlinkSync(filePath);

    res.set('X-Deleted-File', req.params.filename);
    res.set('Cache-Control', 'no-store');

    res.json({
      message: 'Archivo eliminado',
      deleted: req.params.filename
    });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el archivo' });
  }
};

module.exports = { getFiles, uploadFile, downloadFile, deleteFile };