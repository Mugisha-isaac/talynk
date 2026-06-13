'use client';

import React, { ReactNode } from 'react';
import { Input } from '../common/Input';
import { FormError } from './FormError';

interface FormFieldProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  hint?: string;
  autoComplete?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required,
  disabled,
  icon,
  hint,
  autoComplete,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-slate-200">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error ? 'true' : undefined}
        disabled={disabled}
        icon={icon}
        autoComplete={autoComplete}
        required={required}
      />

      {error && <FormError message={error} />}

      {hint && !error && (
        <p className="text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );
};

FormField.displayName = 'FormField';
