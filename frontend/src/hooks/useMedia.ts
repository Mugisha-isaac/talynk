// src/hooks/useMedia.ts
import { useState } from 'react';
import { MediaItem } from '@/types';

interface UploadOptions {
  onProgress?: (progress: number) => void;
  onComplete?: (media: MediaItem) => void;
}

/**
 * useMedia - Handle media upload and management
 * @returns Media management utilities
 */
export function useMedia() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadMedia = async (
    file: File,
    metadata: {
      title: string;
      description: string;
      category: string;
      tags: string[];
    },
    options?: UploadOptions
  ) => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));

      // Upload with progress
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(progress);
          options?.onProgress?.(progress);
        }
      });

      return new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status === 201) {
            const response = JSON.parse(xhr.responseText);
            options?.onComplete?.(response.data);
            resolve(response.data);
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload error'));
        });

        xhr.open('POST', '/api/media/upload');
        xhr.send(formData);
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteMedia = async (mediaId: string) => {
    try {
      const response = await fetch(`/api/media/${mediaId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete media');
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    uploadMedia,
    deleteMedia,
    isUploading,
    uploadProgress,
    error,
  };
}
