import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type CloudinaryResourceType = 'image' | 'video' | 'auto';

export interface CloudinaryUploadResult {
  url: string; // secure_url
  publicId: string;
  resourceType: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes: number;
}

/**
 * Upload a File (from a Next.js formData()) straight to Cloudinary.
 * Audio/video both go through the "video" resource type, per Cloudinary's API.
 */
export async function uploadToCloudinary(
  file: File,
  options: { folder?: string; resourceType?: CloudinaryResourceType } = {}
): Promise<CloudinaryUploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: options.folder || 'talynk',
    resource_type: options.resourceType || 'auto',
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
    width: result.width,
    height: result.height,
    duration: result.duration,
    bytes: result.bytes,
  };
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: CloudinaryResourceType = 'image'
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

/** Maps our ContentType enum to the Cloudinary resource_type it needs. */
export function contentTypeToCloudinaryResource(
  contentType: 'AUDIO' | 'VIDEO' | 'IMAGE'
): CloudinaryResourceType {
  if (contentType === 'IMAGE') return 'image';
  return 'video'; // Cloudinary stores audio under the "video" resource type
}
