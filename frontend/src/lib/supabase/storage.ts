import { supabase } from './client';

export interface UploadOptions {
  bucket: string;
  folder?: string;
}

/**
 * Upload media file to Supabase Storage
 */
export async function uploadMedia(
  file: File,
  options: UploadOptions
): Promise<{ path: string; publicUrl: string }> {
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = options.folder ? `${options.folder}/${fileName}` : fileName;

  const { error } = await supabase.storage
    .from(options.bucket)
    .upload(filePath, file);

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(options.bucket).getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl,
  };
}

/**
 * Delete media file from Supabase Storage
 */
export async function deleteMedia(
  path: string,
  bucket: string
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Generate thumbnail from image using basic approach
 * For production, consider using image processing service
 */
export function generateThumbnailUrl(imageUrl: string): string {
  // Add image transformation parameters for Supabase
  return `${imageUrl}?w=200&h=200&fit=crop`;
}
