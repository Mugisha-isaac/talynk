'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Search,
  Settings,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  isActive?: boolean;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

/**
 * Page Header Component
 * Consistent page title and action area
 */
export function PageHeader({
  title,
  subtitle,
  action,
  breadcrumbs,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 mb-4 text-sm text-text-tertiary">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-text-secondary transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Title and Subtitle */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">{title}</h1>
          {subtitle && <p className="text-text-secondary text-lg">{subtitle}</p>}
        </div>

        {/* Action Button */}
        {action && (
          <Link href={action.href || '#'}>
            <button
              onClick={action.onClick}
              className="px-6 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-blue/20 transition-all duration-300"
            >
              {action.label}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

/**
 * Page Layout Component
 * Standard page layout wrapper
 */
export function PageLayout({
  children,
  className = '',
  maxWidth = 'xl',
}: PageLayoutProps) {
  const maxWidthMap = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'w-full',
  };

  return (
    <main className={`mx-auto px-4 md:px-6 lg:px-8 py-6 ${maxWidthMap[maxWidth]} ${className}`}>
      {children}
    </main>
  );
}

interface SidebarProps {
  items: NavItem[];
  user?: {
    name: string;
    avatar: string;
    email: string;
  };
  userMenuItems?: Array<{ label: string; href?: string; onClick?: () => void }>;
  className?: string;
}

/**
 * Sidebar Component
 * Desktop navigation sidebar
 */
export function Sidebar({
  items,
  user,
  userMenuItems,
  className = '',
}: SidebarProps) {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-bg-dark to-bg-darker border-r border-border-medium p-6 flex flex-col overflow-y-auto ${className}`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-primary-purple rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">TB</span>
        </div>
        <span className="font-bold text-xl text-text-primary">Talynk</span>
      </Link>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-blue/20 text-primary-blue border-l-2 border-primary-blue'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-medium'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-1 bg-accent-orange text-white text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* User Menu */}
      {user && (
        <div className="border-t border-border-medium pt-4 mt-4">
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-bg-medium transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-primary-purple flex items-center justify-center">
                <span className="text-white font-bold">{user.name.charAt(0)}</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-text-primary truncate">{user.name}</p>
                <p className="text-xs text-text-tertiary truncate">{user.email}</p>
              </div>
            </button>

            {/* User Menu Dropdown */}
            {isUserMenuOpen && userMenuItems && (
              <div className="absolute bottom-full right-0 w-48 mb-2 bg-bg-dark border border-border-medium rounded-lg shadow-lg z-50">
                {userMenuItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.onClick}
                    className="w-full text-left px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-bg-medium transition-colors border-b border-border-medium last:border-0"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

interface BottomNavProps {
  items: NavItem[];
  className?: string;
}

/**
 * Bottom Navigation Component
 * Mobile bottom navigation bar
 */
export function BottomNav({ items, className = '' }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 border-t border-border-medium bg-gradient-to-t from-bg-darker to-bg-dark md:hidden ${className}`}
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <button
                className={`flex flex-col items-center justify-center w-full py-4 relative transition-colors ${
                  isActive ? 'text-primary-blue' : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                <div className="text-xl mb-1">{item.icon}</div>
                <span className="text-xs">{item.label}</span>
                {item.badge && (
                  <span className="absolute top-1 right-2 w-5 h-5 bg-accent-orange text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

interface TopNavProps {
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  notificationCount?: number;
  className?: string;
}

/**
 * Top Navigation Component
 * Desktop top navigation bar
 */
export function TopNav({
  showSearch = true,
  onSearch,
  notificationCount = 0,
  className = '',
}: TopNavProps) {
  return (
    <header
      className={`sticky top-0 z-40 bg-gradient-to-b from-bg-dark/80 to-bg-dark/40 border-b border-border-medium backdrop-blur-md ${className}`}
    >
      <div className="h-16 px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Search */}
        {showSearch && (
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-bg-medium border border-border-medium rounded-lg text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-primary-blue/50"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-bg-medium rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-text-secondary" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-orange rounded-full" />
            )}
          </button>
          <button className="p-2 hover:bg-bg-medium rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
      </div>
    </header>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: NavItem[];
  user?: { name: string; avatar: string; email: string };
  topNavProps?: TopNavProps;
  className?: string;
}

/**
 * Dashboard Layout Component
 * Complete dashboard layout with sidebar and top nav
 */
export function DashboardLayout({
  children,
  sidebarItems,
  user,
  topNavProps,
  className = '',
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className={`min-h-screen bg-bg-darkest ${className}`}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar items={sidebarItems} user={user} />
      </div>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Navigation */}
        <TopNav {...topNavProps} />

        {/* Content */}
        <main className="pb-20 md:pb-6">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav items={sidebarItems} />

      {/* Mobile Sidebar (Modal) */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar
            items={sidebarItems}
            user={user}
            className="relative"
          />
        </div>
      )}
    </div>
  );
}

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main Layout Component
 * Simple layout for public pages
 */
export function MainLayout({ children, className = '' }: MainLayoutProps) {
  return (
    <div className={`min-h-screen bg-bg-darkest ${className}`}>
      <main>{children}</main>
    </div>
  );
}

export const layoutComponents = {
  PageHeader,
  PageLayout,
  Sidebar,
  BottomNav,
  TopNav,
  DashboardLayout,
  MainLayout,
};
