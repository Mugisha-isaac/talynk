'use client';

import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import { BottomNav } from './BottomNav';

interface MainLayoutProps {
  children: ReactNode;
  isAuthenticated: boolean;
  userRole?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isAuthenticated,
  userRole,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-bg-darkest text-text-primary">
      {/* Top Navigation */}
      <Navigation isAuthenticated={isAuthenticated} userRole={userRole} />

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation for Mobile (only when authenticated) */}
      {isAuthenticated && <BottomNav userRole={userRole} />}
    </div>
  );
};

MainLayout.displayName = 'MainLayout';
