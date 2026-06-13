'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  Compass,
  Search,
  TrendingUp,
  Upload,
  User,
  Settings,
  Grid,
  Menu,
  X,
  Users,
  Briefcase,
  Map,
  LogOut,
} from 'lucide-react';

interface DashboardNavProps {
  userRole?: string;
  currentPath?: string;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({ userRole = 'TALENT', currentPath = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const mainNav = [
    { href: '/home', label: 'Feed', icon: Home },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/trending', label: 'Trending', icon: TrendingUp },
  ];

  const creatorTools = [
    { href: '/studio', label: 'Studio', icon: Upload, tooltip: 'Upload content' },
    { href: '/profile', label: 'Profile', icon: User, tooltip: 'View your profile' },
  ];

  const roleSpecific = [
    userRole === 'TALENT'
      ? { href: '/dashboard/talent', label: 'Talent Hub', icon: User, tooltip: 'Creator dashboard' }
      : { href: '/dashboard/sponsor', label: 'Sponsor Hub', icon: Briefcase, tooltip: 'Company dashboard' },
  ];

  const discovery = [
    { href: '/talents', label: 'All Talents', icon: Users },
    { href: '/sponsors', label: 'All Sponsors', icon: Briefcase },
    { href: '/sitemap', label: 'Site Map', icon: Map },
  ];

  const settings = [
    { href: '/dashboard/setup', label: 'Setup', icon: Grid },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const NavLink = ({ href, label, icon: Icon, isActive = false }: any) => (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 lg:hidden w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-900/95 border-r border-slate-800 backdrop-blur-md z-30 transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              TB
            </div>
            <span className="text-slate-100">Talynk</span>
          </Link>

          {/* Main Navigation */}
          <nav className="space-y-2">
            <p className="text-xs uppercase font-semibold text-slate-500 px-4 mb-3">Main</p>
            {mainNav.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={currentPath === item.href}
              />
            ))}
          </nav>

          {/* Creator Tools */}
          <nav className="space-y-2 border-t border-slate-800 pt-4">
            <p className="text-xs uppercase font-semibold text-slate-500 px-4 mb-3">Tools</p>
            {creatorTools.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={currentPath === item.href}
              />
            ))}
          </nav>

          {/* Role Specific */}
          {roleSpecific[0] && (
            <nav className="space-y-2 border-t border-slate-800 pt-4">
              <p className="text-xs uppercase font-semibold text-slate-500 px-4 mb-3">
                {userRole === 'TALENT' ? 'Creator' : 'Company'}
              </p>
              <NavLink
                href={roleSpecific[0].href}
                label={roleSpecific[0].label}
                icon={roleSpecific[0].icon}
                isActive={currentPath === roleSpecific[0].href}
              />
            </nav>
          )}

          {/* Discovery */}
          <nav className="space-y-2 border-t border-slate-800 pt-4">
            <p className="text-xs uppercase font-semibold text-slate-500 px-4 mb-3">Discovery</p>
            {discovery.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={currentPath === item.href}
              />
            ))}
          </nav>

          {/* Settings */}
          <nav className="space-y-2 border-t border-slate-800 pt-4">
            <p className="text-xs uppercase font-semibold text-slate-500 px-4 mb-3">Account</p>
            {settings.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={currentPath === item.href}
              />
            ))}
          </nav>

          {/* Logout */}
          <nav className="border-t border-slate-800 pt-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default DashboardNav;
