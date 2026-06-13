'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'base' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'base',
  color = 'primary',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    base: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorStyles = {
    primary: 'border-blue-500',
    white: 'border-white',
    gray: 'border-slate-400',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeStyles[size]}
          border-2
          ${colorStyles[color]}
          border-t-transparent
          rounded-full
          animate-spin
        `}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

LoadingSpinner.displayName = 'LoadingSpinner';
