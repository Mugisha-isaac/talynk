'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

interface DashboardLayoutProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  userRole?: 'TALENT' | 'SPONSOR' | 'ADMIN';
  userName?: string;
}

export function DashboardLayout({
  children,
  isAuthenticated = true,
  userRole = 'TALENT',
  userName = 'User',
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <Sidebar isAuthenticated={isAuthenticated} userRole={userRole} />

      {/* Main Content */}
      <div className="md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Header */}
        <DashboardHeader userRole={userRole} userName={userName} />

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
