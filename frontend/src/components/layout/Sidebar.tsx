'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Mic2,
  BarChart3,
  Heart,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface SidebarProps {
  user?: any;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { icon: Home, label: 'Home', href: '/home' },
    { icon: Compass, label: 'Explore', href: '/explore' },
    { icon: Mic2, label: 'Studio', href: '/studio' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Heart, label: 'Liked', href: '/liked' },
  ];

  const secondaryItems = [
    { icon: MessageCircle, label: 'Messages', href: '/messages', badge: 3 },
    { icon: Bell, label: 'Notifications', href: '/notifications', badge: 5 },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 bottom-0
          w-64 bg-slate-900/95 border-r border-slate-700/50
          backdrop-blur-md
          transition-all duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          z-40
          md:z-0
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-700/50">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Talynk
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${
                  isActive(href)
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }
              `}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}

          {/* Divider */}
          <div className="my-4 border-t border-slate-700/50" />

          {/* Secondary Items */}
          {secondaryItems.map(({ icon: Icon, label, href, badge }) => (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center justify-between px-4 py-3 rounded-lg
                transition-all duration-200
                ${
                  isActive(href)
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }
              `}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </div>
              {badge && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="px-4 py-6 border-t border-slate-700/50 space-y-3">
          {user && (
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Avatar
                src={user.avatarUrl}
                name={user.displayName}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  @{user.username}
                </p>
              </div>
            </Link>
          )}

          <div className="space-y-2">
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm">Settings</span>
            </Link>
            <button
              onClick={() => {
                onLogout?.();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

Sidebar.displayName = 'Sidebar';
