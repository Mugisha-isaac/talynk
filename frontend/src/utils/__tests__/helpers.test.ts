import {
  cn,
  formatDate,
  formatFileSize,
  getMediaIcon,
  getSectorColor,
  getSectorIcon,
} from '@/utils/helpers';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('resolves conflicting tailwind classes, keeping the last one', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('drops falsy values', () => {
    expect(cn('px-2', false && 'hidden', undefined, null)).toBe('px-2');
  });
});

describe('formatDate', () => {
  it('formats a Date object as a long-form US date', () => {
    expect(formatDate(new Date('2026-03-15T00:00:00Z'))).toBe('March 15, 2026');
  });

  it('formats a date string the same way', () => {
    expect(formatDate('2026-03-15T00:00:00Z')).toBe('March 15, 2026');
  });
});

describe('formatFileSize', () => {
  it('returns "0 Bytes" for zero', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
  });

  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 Bytes');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(2048)).toBe('2 KB');
  });

  it('formats megabytes with two decimal places when needed', () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
  });
});

describe('getMediaIcon', () => {
  it.each([
    ['image', '🖼️'],
    ['video', '🎬'],
    ['audio', '🎵'],
    ['document', '📄'],
    ['IMAGE', '🖼️'],
  ])('maps %s to %s', (type, icon) => {
    expect(getMediaIcon(type)).toBe(icon);
  });

  it('falls back to a generic icon for unknown types', () => {
    expect(getMediaIcon('spreadsheet')).toBe('📁');
  });
});

describe('getSectorColor', () => {
  it('returns a known color class for a recognized sector', () => {
    expect(getSectorColor('Music')).toBe('bg-red-100 text-red-800');
  });

  it('falls back to a neutral color for unknown sectors', () => {
    expect(getSectorColor('Unknown Sector')).toBe('bg-gray-100 text-gray-800');
  });
});

describe('getSectorIcon', () => {
  it('returns a known icon for a recognized sector', () => {
    expect(getSectorIcon('Music')).toBe('🎵');
  });

  it('falls back to a star for unknown sectors', () => {
    expect(getSectorIcon('Unknown Sector')).toBe('⭐');
  });
});
