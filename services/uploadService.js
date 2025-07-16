const s3 = require('../config/aws');
const { S3_BUCKET } = process.env;

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
    Expires: 60 * 5, // 5 minutes
  };

  return s3.getSignedUrlPromise('getObject', params);
};

module.exports = { uploadToS3, generatePresignedUrl };
