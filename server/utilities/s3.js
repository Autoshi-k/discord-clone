import dotenv from 'dotenv';
// import S3 from 'aws-sdk/clients/s3';
import { createReadStream } from 'fs';
import AWS from 'aws-sdk';

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new AWS.S3 ({
  region,
  accessKeyId,
  secretAccessKey
})

// upload file to s3
export const uploadAvatar = (file) => {
  if (!file) return;
  const fileStream = createReadStream(file.path); // what does it do actually
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    // Key: 'userAvatars/' + file.filename,
    Key: 'defaultAvatars/' + file.filename,
    ContentType: file.mimetype
  };
  return s3.upload(uploadParams).promise();
}

