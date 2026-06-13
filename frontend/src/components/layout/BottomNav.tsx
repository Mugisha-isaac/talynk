'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Plus,
  MessageCircle,
  User,
} from 'lucide-react';

interface BottomNavProps {
  userRole?: string;
  onUploadClick?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ userRole }) => {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', href: '/dashboard/home' },
    { icon: Compass, label: 'Explore', href: '/discovery/explore' },
    { icon: Plus, label: 'Upload', href: '/dashboard/studio', primary: true, creatorOnly: true },
    { icon: MessageCircle, label: 'Messages', href: '/dashboard/messages' },
    { icon: User, label: 'Profile', href: '/dashboard/settings' },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  // Filter out creator-only items if user is not a creator
  const filteredItems = navItems.filter(
    (item) => !item.creatorOnly || userRole === 'TALENT'
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-bg-dark/95 border-t border-border-medium backdrop-blur-md">
      <div className="flex items-center justify-around h-20">
        {filteredItems.map(({ icon: Icon, label, href, primary }) => (
          <div key={label} className="relative flex-1 h-full flex items-center justify-center">
            {primary ? (
              <Link
                href={href}
                className="flex items-center justify-center h-14 w-14 bg-gradient-primary rounded-2xl text-white shadow-lg shadow-primary-blue/30 hover:shadow-xl transition-all transform -translate-y-2 active:scale-95"
              >
                <Icon size={24} />
              </Link>
            ) : (
              <Link
                href={href}
                className={`
                  h-full flex flex-col items-center justify-center gap-1
                  w-full relative transition-all
                  ${
                    isActive(href)
                      ? 'text-primary-light'
                      : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{label}</span>
                {label === 'Messages' && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-accent-rose rounded-full"></span>
                )}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

BottomNav.displayName = 'BottomNav';
