'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Home, Users, Briefcase, Search, Sparkles, FileText, HelpCircle } from 'lucide-react';

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md glass-effect border-b border-border-medium">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
              <span className="text-gradient">TB</span>
              <span className="hidden sm:inline text-text-primary">Talynk</span>
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Back Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Site Map <span className="text-gradient">Explorer</span>
          </h1>
          <p className="text-text-secondary text-lg">Navigate through all pages and sections of Talynk</p>
        </div>

        {/* Grid of Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Public Pages */}
          <section className="glass-effect p-6 rounded-xl border border-border-light">
            <div className="flex items-center gap-3 mb-6">
              <Home className="w-6 h-6 text-accent-cyan" />
              <h2 className="text-2xl font-bold text-text-primary">Public Pages</h2>
            </div>
            <div className="space-y-3">
              <NavLink href="/" label="Home" description="Landing page with introduction" />
              <NavLink href="/talents" label="Talents Directory" description="Browse all creative talents" />
              <NavLink href="/sponsors" label="Sponsors Directory" description="View all sponsor companies" />
              <NavLink href="/about" label="About Talynk" description="Learn about our mission and team" />
            </div>
          </section>

          {/* Authentication */}
          <section className="glass-effect p-6 rounded-xl border border-border-light">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-accent-pink" />
              <h2 className="text-2xl font-bold text-text-primary">Authentication</h2>
            </div>
            <div className="space-y-3">
              <NavLink href="/login" label="Login" description="Sign in to your account" />
              <NavLink href="/signup" label="Sign Up" description="Create a new account" />
              <NavLink href="/auth/signup?role=talent" label="Sign Up as Talent" description="Join as a creative professional" />
              <NavLink href="/auth/signup?role=sponsor" label="Sign Up as Sponsor" description="Join as a company" />
            </div>
          </section>

          {/* Discovery & Exploration */}
          <section className="glass-effect p-6 rounded-xl border border-border-light">
            <div className="flex items-center gap-3 mb-6">
              <Compass className="w-6 h-6 text-accent-cyan" />
              <h2 className="text-2xl font-bold text-text-primary">Discovery</h2>
            </div>
            <div className="space-y-3">
              <NavLink href="/explore" label="Explore" description="Discover content by categories" />
              <NavLink href="/search" label="Search" description="Search for talents and content" />
              <NavLink href="/trending" label="Trending" description="See what's popular right now" />
            </div>
          </section>

          {/* Dashboard - General */}
          <section className="glass-effect p-6 rounded-xl border border-border-light">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-accent-pink" />
              <h2 className="text-2xl font-bold text-text-primary">Dashboard</h2>
            </div>
            <div className="space-y-3">
              <NavLink href="/home" label="Home Feed" description="Your personalized recommendations" />
              <NavLink href="/studio" label="Studio" description="Upload and manage your content" />
              <NavLink href="/profile" label="My Profile" description="View and edit your profile" />
              <NavLink href="/dashboard/settings" label="Settings" description="Manage account preferences" />
            </div>
          </section>

          {/* Role-Specific Dashboards */}
          <section className="glass-effect p-6 rounded-xl border border-border-light">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-6 h-6 text-accent-cyan" />
              <h2 className="text-2xl font-bold text-text-primary">Role-Specific</h2>
            </div>
            <div className="space-y-3">
              <NavLink href="/dashboard/talent" label="Talent Dashboard" description="Tools for creative professionals" />
              <NavLink href="/dashboard/sponsor" label="Sponsor Dashboard" description="Tools for companies" />
              <NavLink href="/dashboard/setup" label="Setup Wizard" description="Complete your profile setup" />
            </div>
          </section>

          {/* Talent & Sponsor Profiles */}
          <section className="glass-effect p-6 rounded-xl border border-border-light">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-6 h-6 text-accent-pink" />
              <h2 className="text-2xl font-bold text-text-primary">Dynamic Profiles</h2>
            </div>
            <div className="space-y-3">
              <NavLink href="/talents/talent-1" label="Sample Talent Profile" description="Example: /talents/[id]" />
              <NavLink href="/talents/talent-2" label="Another Talent" description="Browse different talent profiles" />
              <NavLink href="/sponsors/sponsor-1" label="Sample Sponsor Profile" description="Example: /sponsors/[id]" />
              <NavLink href="/sponsors/sponsor-2" label="Another Sponsor" description="Browse sponsor companies" />
            </div>
          </section>

          {/* API Endpoints */}
          <section className="glass-effect p-6 rounded-xl border border-border-light">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-accent-cyan" />
              <h2 className="text-2xl font-bold text-text-primary">API Endpoints</h2>
            </div>
            <div className="space-y-3">
              <ApiLink href="/api/health" label="Health Check" description="System status endpoint" />
              <ApiLink href="/api/users" label="Users API" description="User management" />
              <ApiLink href="/api/media" label="Media API" description="Media management" />
              <ApiLink href="/api/recommendations" label="Recommendations API" description="AI recommendations" />
            </div>
          </section>

          {/* Quick Actions */}
          <section className="glass-effect p-6 rounded-xl border border-border-light">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-accent-pink" />
              <h2 className="text-2xl font-bold text-text-primary">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <QuickAction href="/" label="Start Fresh" description="Go to landing page" />
              <QuickAction href="/explore" label="Begin Discovery" description="Explore talents and sponsors" />
              <QuickAction href="/auth/signup" label="Create Account" description="Sign up as talent or sponsor" />
              <QuickAction href="/home" label="Enter Dashboard" description="View personalized content" />
            </div>
          </section>
        </div>

        {/* Features Grid */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-text-primary mb-8">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Talent Discovery"
              description="Find and connect with creative professionals across 8+ categories"
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="AI Matching"
              description="Intelligent matching algorithm connects the right talents with sponsors"
            />
            <FeatureCard
              icon={<Compass className="w-8 h-8" />}
              title="Portfolio Upload"
              description="Showcase your best work - images, videos, audio, and documents"
            />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SectionCard href="/talents" icon={<Users />} title="Talents" />
          <SectionCard href="/sponsors" icon={<Briefcase />} title="Sponsors" />
          <SectionCard href="/explore" icon={<Compass />} title="Explore" />
          <SectionCard href="/search" icon={<Search />} title="Search" />
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Return to Home
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Navigation Link Component
function NavLink({ href, label, description }: { href: string; label: string; description: string }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-bg-medium transition-colors border border-transparent hover:border-border-light"
    >
      <ArrowRight size={18} className="mt-1 text-accent-cyan group-hover:translate-x-1 transition-transform flex-shrink-0" />
      <div>
        <div className="font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">{label}</div>
        <div className="text-sm text-text-secondary">{description}</div>
      </div>
    </Link>
  );
}

// API Link Component
function ApiLink({ href, label, description }: { href: string; label: string; description: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-bg-medium transition-colors border border-transparent hover:border-border-light"
    >
      <ArrowRight size={18} className="mt-1 text-accent-pink group-hover:translate-x-1 transition-transform flex-shrink-0" />
      <div>
        <div className="font-semibold text-text-primary group-hover:text-accent-pink transition-colors">{label}</div>
        <div className="text-sm text-text-secondary">{description}</div>
      </div>
    </a>
  );
}

// Quick Action Component
function QuickAction({ href, label, description }: { href: string; label: string; description: string }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-bg-medium transition-colors border border-transparent hover:border-border-light"
    >
      <ArrowRight size={18} className="mt-1 text-text-secondary group-hover:text-accent-cyan transition-colors flex-shrink-0" />
      <div>
        <div className="font-semibold text-text-primary group-hover:text-text-secondary transition-colors">{label}</div>
        <div className="text-sm text-text-secondary">{description}</div>
      </div>
    </Link>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-effect p-6 rounded-xl border border-border-light hover:border-accent-cyan transition-colors group">
      <div className="text-accent-cyan mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}

// Section Card Component
function SectionCard({ href, icon, title }: { href: string; icon: React.ReactNode; title: string }) {
  return (
    <Link
      href={href}
      className="glass-effect p-6 rounded-xl border border-border-light hover:border-accent-pink transition-all hover:shadow-lg group"
    >
      <div className="text-accent-pink mb-4 group-hover:scale-125 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-pink transition-colors">{title}</h3>
    </Link>
  );
}
