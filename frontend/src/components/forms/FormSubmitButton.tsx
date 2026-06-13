'use client';

import React from 'react';
import { Button } from '../common/Button';

interface FormSubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  className?: string;
  type?: 'submit' | 'button' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  children,
  isLoading = false,
  isDisabled = false,
  variant = 'primary',
  fullWidth = true,
  className = '',
  type = 'submit',
  onClick,
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      size="lg"
      isLoading={isLoading}
      disabled={isDisabled || isLoading}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

FormSubmitButton.displayName = 'FormSubmitButton';
