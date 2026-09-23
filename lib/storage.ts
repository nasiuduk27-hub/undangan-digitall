import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const UPLOAD_LIMITS = {
  photo: {
    maxSizeMB: Number(process.env.MAX_PHOTO_SIZE_MB) || 5,
    allowedMime: ["image/jpeg", "image/png", "image/webp"],
  },
  video: {
    maxSizeMB: Number(process.env.MAX_VIDEO_SIZE_MB) || 100,
    maxDurationSec: Number(process.env.MAX_VIDEO_DURATION_SEC) || 60,
    allowedMime: ["video/mp4", "video/quicktime", "video/webm"],
  },
  audio: {
    maxSizeMB: Number(process.env.MAX_AUDIO_SIZE_MB) || 10,
    maxDurationSec: Number(process.env.MAX_AUDIO_DURATION_SEC) || 300,
    allowedMime: ["audio/mpeg", "audio/mp3", "audio/wav"],
  },
};

const isS3Configured = Boolean(
  process.env.STORAGE_ACCESS_KEY_ID &&
  process.env.STORAGE_SECRET_ACCESS_KEY &&
  process.env.STORAGE_BUCKET_NAME &&
  process.env.STORAGE_ACCESS_KEY_ID !== "mock"
);

export const s3Client = isS3Configured
  ? new S3Client({
      region: "auto",
      endpoint: process.env.STORAGE_ENDPOINT,
      credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || "",
      },
    })
  : null;

export async function createPresignedUploadUrl({
  key,
  contentType,
}: {
  key: string;
  contentType: string;
}): Promise<{ uploadUrl: string; publicUrl: string }> {
  const bucketName = process.env.STORAGE_BUCKET_NAME || "undangan-media";
  const publicCdnUrl = (process.env.STORAGE_PUBLIC_CDN_URL || "").replace(/\/$/, "");

  if (s3Client) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicUrl = publicCdnUrl
      ? `${publicCdnUrl}/${key}`
      : `${process.env.STORAGE_ENDPOINT}/${bucketName}/${key}`;

    return { uploadUrl, publicUrl };
  }

  // Fallback for local development / testing without live R2 bucket
  const publicUrl = `/uploads/${key}`;
  return {
    uploadUrl: `/api/mock-upload?key=${encodeURIComponent(key)}`,
    publicUrl,
  };
}

export async function deleteStorageObject(key: string): Promise<void> {
  if (!s3Client) return;

  const bucketName = process.env.STORAGE_BUCKET_NAME || "undangan-media";
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  await s3Client.send(command);
}
