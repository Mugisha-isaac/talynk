'use client';

import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'base' | 'lg' | 'xl';
  verified?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name = '',
  size = 'base',
  verified = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'avatar-sm',
    base: 'avatar-base-size',
    lg: 'avatar-lg',
    xl: 'w-20 h-20 text-4xl',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative inline-block">
      <div
        className={`
          avatar-base
          ${sizeStyles[size]}
          ${className}
          overflow-hidden
        `}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100px, 150px"
          />
        ) : (
          <span className="font-bold">{initials || '?'}</span>
        )}
      </div>
      {verified && (
        <div className="absolute -bottom-1 -right-1 bg-blue-500 border-2 border-white rounded-full p-1">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';
