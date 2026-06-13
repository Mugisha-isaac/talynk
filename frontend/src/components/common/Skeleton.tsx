'use client';

import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'image' | 'avatar' | 'button' | 'card';
  count?: number;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  count = 1,
  width = '100%',
  height,
  circle = false,
  className = '',
}) => {
  const variantStyles = {
    text: 'skeleton-text h-4',
    image: 'skeleton-image',
    avatar: 'skeleton-avatar',
    button: 'skeleton h-10 w-24',
    card: 'skeleton h-48 w-full',
  };

  const baseHeight = height || (variant === 'text' ? '1rem' : 'auto');

  const skeletons = Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className={`
        skeleton
        ${variantStyles[variant]}
        ${circle ? 'rounded-full' : ''}
        ${className}
      `}
      style={{
        width: width,
        height: baseHeight,
      }}
    />
  ));

  return count === 1 ? skeletons[0] : <div className="space-y-2">{skeletons}</div>;
};

Skeleton.displayName = 'Skeleton';
