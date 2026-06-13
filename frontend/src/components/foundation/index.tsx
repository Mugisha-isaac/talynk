'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  label?: string;
}

/**
 * Divider Component
 * Visual separator between content sections
 * Supports horizontal/vertical orientation with optional label
 */
export function Divider({
  orientation = 'horizontal',
  className = '',
  label,
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal';

  if (label && isHorizontal) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex-1 h-px bg-border-medium" />
        <span className="text-text-muted text-sm font-medium">{label}</span>
        <div className="flex-1 h-px bg-border-medium" />
      </div>
    );
  }

  return (
    <div
      className={`${isHorizontal ? 'h-px w-full' : 'w-px h-full'} bg-border-medium ${className}`}
    />
  );
}

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const sizeMap = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
};

const variantMap = {
  default: 'text-text-secondary',
  primary: 'text-primary-blue',
  secondary: 'text-accent-teal',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
};

/**
 * Icon Component
 * Consistent icon rendering with size and color variants
 */
export function Icon({
  as: Icon,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}: IconProps) {
  if (!Icon) return null;

  return (
    <div
      className={`inline-flex items-center justify-center ${sizeMap[size]} ${variantMap[variant]} ${className}`}
      {...props}
    >
      <Icon className="w-full h-full" />
    </div>
  );
}

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'verified' | 'trending';
  className?: string;
  size?: 'sm' | 'md';
}

const statusConfig = {
  active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Active' },
  inactive: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Inactive' },
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pending' },
  verified: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Verified' },
  trending: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Trending' },
};

/**
 * Status Badge Component
 * Visual indicator for status states
 */
export function StatusBadge({
  status,
  className = '',
  size = 'md',
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full ${config.bg} ${config.text} ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      } font-medium ${className}`}
    >
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${config.text} mr-1.5`} />
      {config.label}
    </div>
  );
}

interface VerificationBadgeProps {
  className?: string;
}

/**
 * Verification Badge Component
 * Premium verification indicator
 */
export function VerificationBadge({ className = '' }: VerificationBadgeProps) {
  return (
    <div
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 ${className}`}
      title="Verified Creator"
    >
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

interface StatisticProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: { direction: 'up' | 'down'; percentage: number };
  className?: string;
}

/**
 * Statistic Component
 * Display key metrics with optional trend indicator
 */
export function Statistic({
  label,
  value,
  unit,
  trend,
  className = '',
}: StatisticProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-text-tertiary text-sm font-medium">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-text-primary">
          {value}
          {unit && <span className="text-sm text-text-secondary ml-1">{unit}</span>}
        </span>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend.direction === 'up' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}%
          </span>
        )}
      </div>
    </div>
  );
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: 'default' | 'primary' | 'subtle';
  underline?: boolean;
  children: React.ReactNode;
  external?: boolean;
}

/**
 * Link Component
 * Consistent link styling with variants
 */
export function TextLink({
  href,
  variant = 'primary',
  underline = false,
  children,
  external = false,
  className = '',
  ...props
}: LinkProps) {
  const variantClasses = {
    default: 'text-text-secondary hover:text-text-primary',
    primary: 'text-primary-blue hover:text-blue-400',
    subtle: 'text-text-tertiary hover:text-text-secondary',
  };

  const Component = external ? 'a' : Link;

  return (
    <Component
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`${variantClasses[variant]} ${
        underline ? 'underline' : 'hover:underline'
      } transition-colors ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

/**
 * Progress Ring Component
 * Circular progress indicator
 */
export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'url(#gradient)',
  label,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;
  const percentage = (value / max) * 100;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-border-medium"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="text-center">
        <div className="text-sm font-semibold text-text-primary">{percentage.toFixed(0)}%</div>
        {label && <div className="text-xs text-text-tertiary">{label}</div>}
      </div>
    </div>
  );
}

export const foundationComponents = {
  Divider,
  Icon,
  StatusBadge,
  VerificationBadge,
  Statistic,
  TextLink,
  ProgressRing,
};
