import { S3Client } from "bun";

export const s3 = new S3Client({
  accessKeyId: Bun.env.S3_ACCESS_KEY_ID!,
  secretAccessKey: Bun.env.S3_SECRET_ACCESS_KEY!,
  bucket: Bun.env.S3_BUCKET!,
  endpoint: Bun.env.S3_ENDPOINT!,
  region: Bun.env.S3_REGION,
});
