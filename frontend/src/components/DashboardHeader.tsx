'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, User, Settings, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface DashboardHeaderProps {
  userRole?: 'TALENT' | 'SPONSOR' | 'ADMIN';
  userName?: string;
}

export function DashboardHeader({ userRole = 'TALENT', userName = 'User' }: DashboardHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 backdrop-blur-sm bg-slate-900/95">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder={userRole === 'TALENT' ? 'Search sponsors...' : 'Search talents...'}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:bg-slate-750 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-4">
          {/* Notifications */}
          <Button
            size="icon"
            variant="ghost"
            className="text-slate-300 hover:text-white hover:bg-slate-800 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          {/* Profile Dropdown */}
          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            </Button>

            {/* Profile Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-slate-700">
                  <p className="text-sm font-semibold text-white">{userName}</p>
                  <p className="text-xs text-slate-400">{userRole}</p>
                </div>
                <nav className="p-2 space-y-1">
                  <Link
                    href={`/dashboard/${userRole === 'TALENT' ? 'talent' : 'sponsor'}/settings`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-md transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href={`/dashboard/${userRole === 'TALENT' ? 'talent' : 'sponsor'}/settings`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-md transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
                    onClick={() => {
                      setIsProfileOpen(false);
                      window.location.href = '/auth/login';
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
