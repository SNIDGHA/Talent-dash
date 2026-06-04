import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const r2AccountId = process.env.R2_ACCOUNT_ID || '';
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
export const r2BucketName = process.env.R2_BUCKET_NAME || '';
export const r2PublicUrl = process.env.R2_PUBLIC_URL || '';

// Initialize S3 client for Cloudflare R2
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
});

/**
 * Uploads a file/buffer to Cloudflare R2 bucket.
 * 
 * @param key File path in R2 bucket (e.g., 'logos/google.png')
 * @param body File contents (Buffer, String, etc.)
 * @param contentType MIME type of the file (e.g., 'image/png')
 */
export async function uploadToR2(key: string, body: Buffer | Uint8Array | string, contentType: string) {
  if (!r2BucketName) {
    throw new Error('R2_BUCKET_NAME environment variable is not defined.');
  }

  const command = new PutObjectCommand({
    Bucket: r2BucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Return public URL if configured, otherwise key identifier
  return r2PublicUrl ? `${r2PublicUrl.replace(/\/$/, '')}/${key}` : key;
}

/**
 * Deletes an object from Cloudflare R2 bucket.
 * 
 * @param key File path in R2 bucket
 */
export async function deleteFromR2(key: string) {
  if (!r2BucketName) {
    throw new Error('R2_BUCKET_NAME environment variable is not defined.');
  }

  const command = new DeleteObjectCommand({
    Bucket: r2BucketName,
    Key: key,
  });

  return await r2Client.send(command);
}
