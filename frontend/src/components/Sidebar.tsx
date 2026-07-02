'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  Home,
  Users,
  Zap,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface SidebarProps {
  isAuthenticated?: boolean;
  userRole?: 'TALENT' | 'SPONSOR' | 'ADMIN';
}

export function Sidebar({ isAuthenticated = false, userRole = 'TALENT' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  if (!isAuthenticated) return null;

  const isDashboard = pathname.includes('/dashboard');
  if (!isDashboard) return null;

  const menuItems = [
    {
      label: 'Home',
      href: `/dashboard/${userRole === 'TALENT' ? 'talent' : 'sponsor'}`,
      icon: Home,
    },
    {
      label: userRole === 'TALENT' ? 'My Portfolio' : 'Browse Talents',
      href: userRole === 'TALENT' ? '/talent' : '/talents',
      icon: Users,
    },
    {
      label: userRole === 'TALENT' ? 'My Profile' : 'My Clients',
      href: `/dashboard/${userRole === 'TALENT' ? 'talent' : 'sponsor'}/settings`,
      icon: Zap,
    },
    {
      label: 'Settings',
      href: `/dashboard/${userRole === 'TALENT' ? 'talent' : 'sponsor'}/settings`,
      icon: Settings,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-6 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            T
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg text-white truncate">Talynk</span>
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-3 py-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 text-gray-300 hover:bg-red-900/20 hover:text-red-400',
            isCollapsed && 'justify-center'
          )}
          onClick={() => {
            // Handle logout
            window.location.href = '/auth/login';
          }}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <Button
          size="icon"
          variant="outline"
          className="bg-gray-900 border-gray-700"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 z-40 hidden md:flex flex-col',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {sidebarContent}

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-gray-800 border border-gray-700 rounded-full p-1 hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft
            className={cn('w-4 h-4 text-gray-300 transition-transform', isCollapsed && 'rotate-180')}
          />
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 z-30 md:hidden flex flex-col',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Spacer for Desktop */}
      <div className={cn('hidden md:block transition-all duration-300', isCollapsed ? 'w-20' : 'w-64')} />
    </>
  );
}