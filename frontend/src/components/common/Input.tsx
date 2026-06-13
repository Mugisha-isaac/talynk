'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'base' | 'filled' | 'flushed';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    icon, 
    variant = 'base',
    className = '', 
    ...props 
  }, ref) => {
    const variantStyles = {
      base: 'input-base',
      filled: 'bg-slate-700 border-0 rounded-lg focus:bg-slate-600',
      flushed: 'bg-transparent border-0 border-b-2 border-slate-700 rounded-0 focus:border-blue-500',
    };

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-medium text-slate-200">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              ${variantStyles[variant]}
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500' : ''}
              ${className}
              w-full
            `}
            {...props}
          />
        </div>
        {error && (
          <span className="text-sm text-red-400">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
