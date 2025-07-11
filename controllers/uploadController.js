const { uploadToS3, generatePresignedUrl } = require('../services/uploadService');
const catchAsync = require('../utils/catchAsync');

const allowedMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

exports.uploadFile = catchAsync(async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return res.status(400).json({ error: 'Unsupported file type' });
  }

  const s3Key = `${Date.now()}_${file.originalname}`;
  await uploadToS3(file, s3Key);
  const presignedUrl = await generatePresignedUrl(s3Key);

  res.status(200).json({
    message: 'File uploaded successfully',
    key: s3Key,
    url: presignedUrl,
  });
});

exports.getPresignedUrl = catchAsync(async (req, res) => {
  const { filename } = req.params;
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  const url = await generatePresignedUrl(filename);
  res.status(200).json({ url });
});
