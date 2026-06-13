'use client';

import React, { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="w-full">
      {children}
    </div>
  );
};

PageLayout.displayName = 'PageLayout';
