// src/app/(auth)/signup/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Loader, Zap, Briefcase, Music } from 'lucide-react';
import { UserRole } from '@/types';

type SignupStep = 'account' | 'role';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>('account');
  
  // Account info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Role selection
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateAccount = () => {
    setError('');
    
    if (!name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleAccountNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAccount()) {
      setStep('role');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!selectedRole) {
      setError('Please select a role');
      setLoading(false);
      return;
    }

    try {
      // TODO: Implement actual Supabase authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Redirect based on role
      if (selectedRole === UserRole.TALENT) {
        router.push('/auth/onboarding/creator');
      } else if (selectedRole === UserRole.SPONSOR) {
        router.push('/auth/onboarding/sponsor');
      } else {
        router.push('/home');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string; description: string; icon: React.ReactNode }[] = [
    {
      value: UserRole.TALENT,
      label: 'I\'m a Creator',
      description: 'Showcase your talent and get discovered',
      icon: <Music size={24} />,
    },
    {
      value: UserRole.SPONSOR,
      label: 'I\'m a Scout/Brand',
      description: 'Find and collaborate with talented creators',
      icon: <Briefcase size={24} />,
    },
    {
      value: UserRole.FAN,
      label: 'I\'m Exploring',
      description: 'Discover amazing talent in my community',
      icon: <Zap size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Talynk</h1>
              <p className="text-xs text-slate-400">Talent Meets Opportunity</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            {step === 'account' ? 'Create your account' : 'Choose your role'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-2 mb-6">
          <div
            className={`flex-1 h-1 rounded-full transition-all ${
              step === 'account' ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          ></div>
          <div
            className={`flex-1 h-1 rounded-full transition-all ${
              step === 'role' ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          ></div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Account Step */}
          {step === 'account' && (
            <form onSubmit={handleAccountNext} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
                    required
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Minimum 8 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-600 mt-0.5 accent-blue-600"
                  required
                />
                <span className="text-xs text-slate-400">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>

              {/* Continue Button */}
              <button
                type="submit"
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
              >
                Continue
              </button>
            </form>
          )}

          {/* Role Selection Step */}
          {step === 'role' && (
            <form onSubmit={handleSignup} className="space-y-3">
              <p className="text-slate-400 text-sm mb-4">
                What describes you best?
              </p>

              {/* Role Options */}
              <div className="space-y-2.5">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`w-full p-3.5 rounded-lg border transition-all text-left flex items-start gap-3 ${
                      selectedRole === role.value
                        ? 'border-blue-600 bg-blue-600/10'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className={`mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center ${
                      selectedRole === role.value
                        ? 'text-blue-400'
                        : 'text-slate-400'
                    }`}>
                      {role.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-100 text-sm">
                        {role.label}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {role.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading || !selectedRole}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => setStep('account')}
                className="w-full text-slate-400 hover:text-slate-300 font-medium py-2 rounded-lg transition-colors text-sm"
              >
                Back
              </button>
            </form>
          )}

          {/* Sign In Link */}
          <p className="mt-4 text-center text-slate-400 text-xs">
            Have an account?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
