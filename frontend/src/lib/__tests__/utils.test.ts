import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges class names in order', () => {
    expect(cn('flex', 'items-center')).toBe('flex items-center');
  });

  it('lets tailwind-merge resolve conflicting utility classes', () => {
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('supports conditional object syntax via clsx', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active');
  });
});
