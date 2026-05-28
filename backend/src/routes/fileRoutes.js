const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getFiles, uploadFile, downloadFile, deleteFile } = require('../controllers/fileController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000000
  }
});

router.get('/', getFiles);
router.post('/upload', upload.single('file'), uploadFile);
router.get('/download/:filename', downloadFile);
router.delete('/:filename', deleteFile);

module.exports = router;