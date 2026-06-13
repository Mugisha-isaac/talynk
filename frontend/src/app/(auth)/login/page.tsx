// src/app/(auth)/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, Loader, Github, Mail as GoogleIcon } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implement actual Supabase authentication
      // For now, just simulate
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to dashboard
      router.push('/dashboard/home');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-night flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left gradient orb */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary-blue/20 to-transparent rounded-full blur-3xl"></div>
        
        {/* Bottom right gradient orb */}
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-accent-success/10 to-transparent rounded-full blur-3xl"></div>
        
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Heading */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/20 to-accent-success/20 rounded-lg blur-lg"></div>
              <Image
                src="/logo.png"
                alt="Talynk"
                width={48}
                height={48}
                className="rounded-lg relative"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-white">Talynk</h1>
          </div>
          <p className="text-text-secondary">Welcome back</p>
        </div>

        {/* Login Card */}
        <div className="bg-bg-secondary border border-border-medium rounded-2xl p-8 shadow-xl glass-effect animate-scale-in">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-accent-error/10 border border-accent-error/30 rounded-lg text-accent-error text-sm animate-slide-down">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-text-muted" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-bg-tertiary border border-border-medium rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-text-muted" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bg-tertiary border border-border-medium rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border-medium" />
                <span className="text-text-secondary">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-primary-blue hover:text-primary-light transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border-medium"></div>
            <span className="text-text-muted text-sm">Or continue with</span>
            <div className="flex-1 h-px bg-border-medium"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 bg-bg-tertiary hover:bg-bg-light border border-border-medium text-text-primary font-semibold py-3 rounded-lg transition-all">
              <GoogleIcon size={20} />
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-bg-tertiary hover:bg-bg-light border border-border-medium text-text-primary font-semibold py-3 rounded-lg transition-all">
              <Github size={20} />
              Continue with GitHub
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-text-secondary">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary-blue hover:text-primary-light font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-text-muted text-xs mt-6">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="hover:text-text-secondary transition-colors">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link href="/privacy" className="hover:text-text-secondary transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
