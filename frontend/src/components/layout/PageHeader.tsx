'use client';

import React, { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  subtitle?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`pt-6 pb-8 border-b border-slate-700/50 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-sm text-slate-400">{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-600" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Header Content */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg font-semibold text-blue-400 mb-2">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-slate-400 text-base max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-3 flex-wrap md:flex-nowrap justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

PageHeader.displayName = 'PageHeader';
