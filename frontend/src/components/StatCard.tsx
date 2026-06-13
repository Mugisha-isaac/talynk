'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: 'blue' | 'amber' | 'green' | 'cyan';
}

export function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  accent = 'blue',
}: StatCardProps) {
  const accentColors = {
    blue: '#3B82F6',
    amber: '#F59E0B',
    green: '#10B981',
    cyan: '#06B6D4',
  };

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/15 transition-all duration-300 border border-slate-700/50 hover:border-slate-600/75 backdrop-blur-sm">
      {/* Top Accent Bar - Refined */}
      <div 
        style={{ backgroundColor: accentColors[accent] }} 
        className="h-1 opacity-90"
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-slate-400">{title}</h3>
          </div>
          <div 
            className="p-3 rounded-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: `${accentColors[accent]}15` }}
          >
            <Icon className="w-5 h-5" style={{ color: accentColors[accent] }} />
          </div>
        </div>

        <div>
          <div className="text-4xl font-bold text-slate-50 mb-2 leading-tight">{value}</div>
          {subtitle && <p className="text-sm text-slate-500 leading-relaxed">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
