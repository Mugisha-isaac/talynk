'use client';

import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '../common/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  trend,
  icon,
  color = 'blue',
  className = '',
}) => {
  const colorStyles = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const getTrendColor = () => {
    if (!trend) return 'text-slate-400';
    return trend === 'up' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <Card variant="standard" className={`p-6 ${className}`}>
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg border ${colorStyles[color]}`}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-3">
        <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
      </div>

      {/* Change Indicator */}
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
          {trend === 'up' ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          <span>{Math.abs(change)}% {trend === 'up' ? 'increase' : 'decrease'}</span>
        </div>
      )}
    </Card>
  );
};

StatCard.displayName = 'StatCard';
