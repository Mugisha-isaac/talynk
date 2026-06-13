// src/components/layout/Navigation.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Compass, Upload, Bell, MessageSquare, User } from 'lucide-react';
import Image from 'next/image';

interface NavigationProps {
  isAuthenticated: boolean;
  userRole?: string;
  onMenuClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  isAuthenticated,
  userRole,
  onMenuClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    onMenuClick?.();
  };

  if (!isAuthenticated) {
    return (
      <nav className="sticky top-0 z-50 backdrop-blur-md glass-effect border-b border-border-medium">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="Talynk"
                width={40}
                height={40}
                className="rounded-lg"
                priority
              />
              <span className="hidden sm:inline text-text-primary">Talynk</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-text-secondary hover:text-text-primary transition-colors">
                About
              </Link>
              <Link href="/explore" className="text-text-secondary hover:text-text-primary transition-colors">
                Explore
              </Link>
              <Link href="/sitemap" className="text-text-secondary hover:text-text-primary transition-colors">
                Site Map
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-text-primary hover:text-text-secondary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={handleMenuToggle}
              className="md:hidden p-2 hover:bg-bg-medium rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border-medium pt-4 animate-slide-down">
              <div className="flex flex-col gap-4">
                <Link href="/" className="text-text-primary hover:text-text-secondary transition-colors">
                  Home
                </Link>
                <Link href="/about" className="text-text-primary hover:text-text-secondary transition-colors">
                  About
                </Link>
                <Link href="/explore" className="text-text-primary hover:text-text-secondary transition-colors">
                  Explore
                </Link>              <Link href="/sitemap" className="text-text-primary hover:text-text-secondary transition-colors">
                Site Map
              </Link>                <div className="border-t border-border-medium pt-4 flex flex-col gap-3">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-center text-text-primary"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Authenticated Navigation
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md glass-effect border-b border-border-medium">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
              TB
            </div>
            <span className="hidden sm:inline text-text-primary">Talynk</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/dashboard/home"
              className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2"
            >
              <Home size={20} />
              <span>Feed</span>
            </Link>
            <Link
              href="/discovery/explore"
              className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2"
            >
              <Compass size={20} />
              <span>Explore</span>
            </Link>
            {userRole === 'TALENT' && (
              <Link
                href="/dashboard/studio"
                className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2"
              >
                <Upload size={20} />
                <span>Studio</span>
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-bg-medium rounded-lg transition-colors hidden sm:block">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-rose rounded-full"></span>
            </button>

            {/* Messages */}
            <button className="relative p-2 hover:bg-bg-medium rounded-lg transition-colors hidden sm:block">
              <MessageSquare size={20} />
            </button>

            {/* Upload Button - Floating Action */}
            <Link
              href="/dashboard/studio"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all hidden sm:flex"
            >
              <Upload size={18} />
              <span>Upload</span>
            </Link>

            {/* User Menu */}
            <button className="p-2 hover:bg-bg-medium rounded-lg transition-colors">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <User size={18} />
              </div>
            </button>

            {/* Mobile Menu */}
            <button onClick={handleMenuToggle} className="lg:hidden p-2">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu for Authenticated Users */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border-medium pt-4 animate-slide-down">
            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard/home"
                className="flex items-center gap-2 px-4 py-2 text-text-primary hover:bg-bg-medium rounded-lg transition-colors"
              >
                <Home size={20} />
                Feed
              </Link>
              <Link
                href="/discovery/explore"
                className="flex items-center gap-2 px-4 py-2 text-text-primary hover:bg-bg-medium rounded-lg transition-colors"
              >
                <Compass size={20} />
                Explore
              </Link>
              {userRole === 'TALENT' && (
                <Link
                  href="/dashboard/studio"
                  className="flex items-center gap-2 px-4 py-2 text-text-primary hover:bg-bg-medium rounded-lg transition-colors"
                >
                  <Upload size={20} />
                  Studio
                </Link>
              )}
              <Link
                href="/dashboard/messages"
                className="flex items-center gap-2 px-4 py-2 text-text-primary hover:bg-bg-medium rounded-lg transition-colors"
              >
                <MessageSquare size={20} />
                Messages
              </Link>
              <Link
                href="/dashboard/notifications"
                className="flex items-center gap-2 px-4 py-2 text-text-primary hover:bg-bg-medium rounded-lg transition-colors"
              >
                <Bell size={20} />
                Notifications
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 px-4 py-2 text-text-primary hover:bg-bg-medium rounded-lg transition-colors"
              >
                <User size={20} />
                Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
