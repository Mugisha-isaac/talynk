// src/components/FeedLayout.tsx
'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';

interface FeedLayoutProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
}

export function FeedLayout({ children, sidebarContent }: FeedLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 z-40">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pb-20 lg:pb-0">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between h-16 px-4">
            <h1 className="text-xl font-bold text-white">Talynk</h1>
            <div className="flex items-center gap-2">
              {/* Mobile actions */}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 lg:p-8 max-w-7xl mx-auto">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            {children}
          </div>

          {/* Sidebar Content (Desktop Only) */}
          {sidebarContent && (
            <div className="hidden lg:block space-y-6">
              {sidebarContent}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNav />
      </div>
    </div>
  );
}
