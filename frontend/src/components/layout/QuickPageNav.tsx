'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  Compass,
  Search,
  TrendingUp,
  Users,
  Briefcase,
  Upload,
  User,
  Settings,
  Grid,
  Map,
} from 'lucide-react';

export const QuickPageNav: React.FC = () => {
  const pages = [
    {
      category: 'Dashboard',
      items: [
        { href: '/home', label: 'Feed', icon: Home, description: 'Your recommendations' },
        { href: '/explore', label: 'Explore', icon: Compass, description: 'Discover content' },
        { href: '/search', label: 'Search', icon: Search, description: 'Find talents' },
        { href: '/trending', label: 'Trending', icon: TrendingUp, description: 'What\'s hot' },
      ],
    },
    {
      category: 'Creator Tools',
      items: [
        { href: '/studio', label: 'Studio', icon: Upload, description: 'Upload content' },
        { href: '/profile', label: 'Profile', icon: User, description: 'Your profile' },
      ],
    },
    {
      category: 'Discovery',
      items: [
        { href: '/talents', label: 'All Talents', icon: Users, description: 'Browse talents' },
        { href: '/sponsors', label: 'All Sponsors', icon: Briefcase, description: 'Browse sponsors' },
      ],
    },
    {
      category: 'Settings',
      items: [
        { href: '/dashboard/setup', label: 'Setup', icon: Grid, description: 'Profile setup' },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings, description: 'Preferences' },
        { href: '/sitemap', label: 'Site Map', icon: Map, description: 'All pages' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {pages.map((section) => (
        <div key={section.category}>
          <h3 className="text-sm font-semibold uppercase text-slate-400 mb-4 px-4">{section.category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {section.items.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className="group p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-blue-500/30 transition-all duration-200 hover:shadow-md hover:shadow-blue-500/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <Icon size={20} className="text-blue-400" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors mb-1">
                    {page.label}
                  </h4>
                  <p className="text-xs text-slate-400">{page.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickPageNav;
