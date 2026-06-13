'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gold';
  size?: 'sm' | 'base' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'base',
  icon,
  className = '',
}) => {
  const variantStyles = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    error: 'bg-red-500/20 text-red-300 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    gold: 'bg-gold-500/20 text-gold-300 border border-gold-500/30',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    base: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`
        badge-base
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
