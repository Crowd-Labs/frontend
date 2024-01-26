// Upload and Get from Amazon S3 Bucket
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createReadStream } from 'fs';

const bucketName = process.env.BUCKET_NAME || '';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
const region = process.env.REGION || '';

// Configure AWS SDK
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export function getS3UrlByKey(key: string) {
  const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  return url;
}

export async function getObjectURL(key:string) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  const url = getSignedUrl(s3Client, command);
  return url;
}

// Function to upload a file to S3
export async function uploadFile(key: string, filePath: string) {
  const fileStream = createReadStream(filePath);

  const params = {
    Bucket: bucketName,
    Key: key, // Define the path and filename in S3
    Body: fileStream,
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    console.log(`File uploaded successfully. URL: ${response.$metadata.httpStatusCode}`);
    // return s3keyUrl(key)
  } catch (err) {
    console.error(err);
  }
}
