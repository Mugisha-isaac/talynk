'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'premium' | 'standard' | 'elevated' | 'gradient';
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    variant = 'standard', 
    className = '',
    hoverEffect = true,
    onClick,
  }, ref) => {
    const variantStyles = {
      premium: 'glass-card',
      standard: 'card-base',
      elevated: 'bg-slate-800 border-0 rounded-2xl shadow-lg hover:shadow-xl',
      gradient: 'bg-gradient-primary rounded-2xl shadow-lg shadow-blue-500/20',
    };

    return (
      <div
        ref={ref}
        className={`
          ${variantStyles[variant]}
          ${hoverEffect ? 'transition-all duration-300 cursor-pointer' : ''}
          ${onClick ? 'hover:scale-105' : ''}
          ${className}
        `}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
