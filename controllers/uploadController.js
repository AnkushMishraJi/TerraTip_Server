const { handleUploadAndGetUrl, generatePresignedUrlByFilename } = require('../services/uploadService');
const catchAsync = require('../utils/catchAsync');

exports.uploadFile = catchAsync(async (req, res) => {
  const result = await handleUploadAndGetUrl(req.file);
  res.status(200).json(result);
});

exports.getPresignedUrl = catchAsync(async (req, res) => {
  const { filename } = req.params;
  const url = await generatePresignedUrlByFilename(filename);
  res.status(200).json({ url });
});
