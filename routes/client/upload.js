const express = require('express');
const multer = require('multer');
const { uploadFile, getPresignedUrl } = require('../../controllers/uploadController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), uploadFile); // ✅ maps to POST /upload

router.get('/url/:filename', getPresignedUrl);

module.exports = router;
