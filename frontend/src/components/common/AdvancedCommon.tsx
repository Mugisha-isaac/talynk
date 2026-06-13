'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Empty State Component
 * Displays when no content is available
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-primary-blue/10 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      {description && <p className="text-text-secondary mb-6 max-w-sm">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-primary-blue hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * Loading Spinner Component
 */
export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-border-medium" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-blue border-r-primary-purple animate-spin" />
      </div>
    </div>
  );
}

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const notificationConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    title: 'text-green-400',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    title: 'text-red-400',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    title: 'text-yellow-400',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    title: 'text-blue-400',
  },
};

/**
 * Notification Component
 * Toast-like notification display
 */
export function Notification({
  type,
  title,
  description,
  onClose,
  autoClose = true,
  duration = 4000,
}: NotificationProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const config = notificationConfig[type];
  const Icon = config.icon;

  React.useEffect(() => {
    if (!autoClose || !isVisible) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [autoClose, duration, isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${config.bg} ${config.border} backdrop-blur-sm`}
    >
      <Icon className={`w-5 h-5 ${config.title} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`font-semibold ${config.title}`}>{title}</p>
        {description && <p className="text-text-secondary text-sm mt-1">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="text-text-tertiary hover:text-text-secondary transition-colors flex-shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  );
}

interface SkeletonProps {
  variant?: 'card' | 'text' | 'avatar' | 'image';
  count?: number;
  className?: string;
}

/**
 * Skeleton Loading Component
 * Placeholder for loading states
 */
export function Skeleton({ variant = 'text', count = 1, className = '' }: SkeletonProps) {
  const variants = {
    card: 'h-32 rounded-xl',
    text: 'h-4 rounded',
    avatar: 'w-12 h-12 rounded-full',
    image: 'h-48 rounded-lg',
  };

  return (
    <div className={className}>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`${variants[variant]} bg-gradient-to-r from-bg-medium via-bg-dark to-bg-medium bg-[length:200%_100%] animate-shimmer ${
              i > 0 ? 'mt-3' : ''
            }`}
          />
        ))}
    </div>
  );
}

interface PaginationProps {
  current: number;
  total: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

/**
 * Pagination Component
 */
export function Pagination({
  current,
  total,
  onPageChange,
  className = '',
}: PaginationProps) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const visiblePages = pages.filter((page) => {
    const distance = Math.abs(page - current);
    return distance <= 2 || page === 1 || page === total;
  });

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange?.(current - 1)}
        disabled={current === 1}
        className="px-3 py-2 rounded-lg bg-bg-medium border border-border-medium text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ← Previous
      </button>

      <div className="flex gap-1">
        {visiblePages.map((page, idx) => {
          const showEllipsis =
            idx > 0 && visiblePages[idx - 1] !== page - 1;

          return (
            <React.Fragment key={page}>
              {showEllipsis && (
                <span className="px-2 py-2 text-text-tertiary">...</span>
              )}
              <button
                onClick={() => onPageChange?.(page)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  current === page
                    ? 'bg-primary-blue text-white'
                    : 'bg-bg-medium border border-border-medium text-text-secondary hover:text-text-primary'
                }`}
              >
                {page}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange?.(current + 1)}
        disabled={current === total}
        className="px-3 py-2 rounded-lg bg-bg-medium border border-border-medium text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  );
}

interface TabsProps {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

/**
 * Tabs Component
 */
export function Tabs({
  tabs,
  defaultTab,
  onChange,
  className = '',
}: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={className}>
      {/* Tab Buttons */}
      <div className="flex gap-4 border-b border-border-medium mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-3 font-medium border-b-2 transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-primary-blue text-primary-blue'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

export const commonComponents = {
  EmptyState,
  LoadingSpinner,
  Notification,
  Skeleton,
  Pagination,
  Tabs,
};
