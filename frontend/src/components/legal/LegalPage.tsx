'use client';

import { ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <>
      <Navigation />

      <section className="bg-slate-950 py-16 sm:py-20 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
            <p className="text-slate-400">Last updated: {lastUpdated}</p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-10 text-slate-300 leading-relaxed">
            {children}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

interface LegalSectionProps {
  number?: string;
  title: string;
  children: ReactNode;
}

export function LegalSection({ number, title, children }: LegalSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-3">
        {number ? `${number}. ` : ''}
        {title}
      </h2>
      <div className="space-y-3 text-slate-400">{children}</div>
    </div>
  );
}