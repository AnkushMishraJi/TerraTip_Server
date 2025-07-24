const s3 = require('../config/aws');
const { S3_BUCKET } = process.env;

const allowedMimeTypes = [
  'application/pdf',
  // 'application/msword',
  // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

const uploadToS3 = async (file, key) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return s3.upload(params).promise();
};

const generatePresignedUrl = async (key) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    // Expires: 60 * 5,
    Expires: 60 * 60 * 24 * 7,
  };

  return s3.getSignedUrlPromise('getObject', params);
};

const handleUploadAndGetUrl = async (file) => {
  if (!file) {
    const error = new Error('No file uploaded');
    error.statusCode = 400;
    throw error;
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error('Unsupported file type');
    error.statusCode = 400;
    throw error;
  }

  const s3Key = `Property_Document/${Date.now()}_${file.originalname}`;
  await uploadToS3(file, s3Key);
  const presignedUrl = await generatePresignedUrl(s3Key);

  return {
    message: 'File uploaded successfully',
    key: s3Key,
    url: presignedUrl,
  };
};

const generatePresignedUrlByFilename = async (filename) => {
  if (!filename) {
    const error = new Error('Filename is required');
    error.statusCode = 400;
    throw error;
  }

  return await generatePresignedUrl(filename);
};

module.exports = {
  uploadToS3,
  generatePresignedUrl,
  handleUploadAndGetUrl,
  generatePresignedUrlByFilename,
};
