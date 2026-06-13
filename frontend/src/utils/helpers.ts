import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function getMediaIcon(type: string): string {
  switch (type.toLowerCase()) {
    case 'image':
      return '🖼️';
    case 'video':
      return '🎬';
    case 'audio':
      return '🎵';
    case 'document':
      return '📄';
    default:
      return '📁';
  }
}

export function getSectorColor(sector: string): string {
  const colors: Record<string, string> = {
    'Visual Arts': 'bg-purple-100 text-purple-800',
    Photography: 'bg-blue-100 text-blue-800',
    Design: 'bg-pink-100 text-pink-800',
    Music: 'bg-red-100 text-red-800',
    'Film & Video': 'bg-orange-100 text-orange-800',
    Fashion: 'bg-green-100 text-green-800',
    'Performance & Theater': 'bg-yellow-100 text-yellow-800',
    Sports: 'bg-indigo-100 text-indigo-800',
  };

  return colors[sector] || 'bg-gray-100 text-gray-800';
}

export function getSectorIcon(sector: string): string {
  const icons: Record<string, string> = {
    'Visual Arts': '🎨',
    Photography: '📷',
    Design: '✏️',
    Music: '🎵',
    'Film & Video': '🎬',
    Fashion: '👗',
    'Performance & Theater': '🎭',
    Sports: '⚽',
  };

  return icons[sector] || '⭐';
}
