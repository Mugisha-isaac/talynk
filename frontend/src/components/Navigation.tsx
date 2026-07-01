'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavigationProps {
  isAuthenticated?: boolean;
  userRole?: 'TALENT' | 'SPONSOR' | 'ADMIN';
  userName?: string;
}

function dashboardHref(role: 'TALENT' | 'SPONSOR' | 'ADMIN'): string {
  if (role === 'ADMIN') return '/admin';
  if (role === 'TALENT') return '/dashboard/talent';
  return '/sponsors';
}

function settingsHref(role: 'TALENT' | 'SPONSOR' | 'ADMIN'): string {
  if (role === 'ADMIN') return '/admin';
  if (role === 'TALENT') return '/dashboard/talent/settings';
  return '/dashboard/sponsor/settings';
}

export function Navigation({
  isAuthenticated: isAuthenticatedProp,
  userRole: userRoleProp,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [sessionAuthenticated, setSessionAuthenticated] = useState(false);
  const [sessionRole, setSessionRole] = useState<'TALENT' | 'SPONSOR' | 'ADMIN' | undefined>(undefined);

  // Many pages render <Navigation /> without passing auth props at all, which
  // used to always show the logged-out state even for a signed-in user. To
  // fix that without touching every page, Navigation checks the session
  // itself and only defers to explicit props when a page has already done
  // its own check (e.g. /admin, which redirects unauthorized users).
  useEffect(() => {
    if (isAuthenticatedProp !== undefined) {
      setSessionChecked(true);
      return;
    }

    let cancelled = false;
    fetch('/api/auth/session')
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (cancelled) return;
        const role = data?.user?.role as string | undefined;
        if (role === 'TALENT' || role === 'SPONSOR' || role === 'ADMIN') {
          setSessionAuthenticated(true);
          setSessionRole(role);
        }
      })
      .catch(() => {
        /* treat as logged out */
      })
      .finally(() => {
        if (!cancelled) setSessionChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticatedProp]);

  const isAuthenticated = isAuthenticatedProp ?? sessionAuthenticated;
  const userRole = userRoleProp ?? sessionRole;

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Even if the request fails, still send the user to login; the cookie
      // will simply expire on its own if it wasn't cleared server-side.
    }
    // A hard navigation (not router.push) ensures every client component,
    // including this one's cached session state, re-reads from a clean slate.
    window.location.href = '/login';
  };

  // Avoid flashing "Login / Sign Up" for an already-authenticated user while
  // the session check is still in flight.
  if (!sessionChecked && isAuthenticatedProp === undefined) {
    return (
      <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 backdrop-blur-md bg-slate-900/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold text-sm group-hover:bg-blue-600 transition-colors">
                T
              </div>
              <span className="text-lg font-bold text-white">Talynk</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 backdrop-blur-md bg-slate-900/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* Icon */}
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold text-sm group-hover:bg-blue-600 transition-colors">
              T
            </div>
            {/* Text */}
            <span className="text-lg font-bold text-white">Talynk</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/talents"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Talents
            </Link>
            <Link
              href="/sponsors"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Sponsors
            </Link>
            <Link
              href="/about"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              About
            </Link>
          </div>

          {/* Right side - Auth/User Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated && userRole ? (
              <>
                <Link
                  href={dashboardHref(userRole)}
                  className="hidden sm:block text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href={settingsHref(userRole)}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-gray-800 pt-4">
            <Link
              href="/talents"
              className="block text-sm text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Talents
            </Link>
            <Link
              href="/sponsors"
              className="block text-sm text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sponsors
            </Link>
            <Link
              href="/about"
              className="block text-sm text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            {isAuthenticated && userRole && (
              <>
                <div className="border-t border-gray-800 pt-3 mt-3 space-y-3">
                  <Link
                    href={dashboardHref(userRole)}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={settingsHref(userRole)}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block text-sm text-red-600 hover:text-red-700 transition-colors w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2">
                <Link
                  href="/login"
                  className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-xs"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 text-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
