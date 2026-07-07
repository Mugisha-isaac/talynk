'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ArrowRight, CheckCircle, Users, Zap, Shield, Eye } from 'lucide-react';

export default function HomePage() {
  // Hero background image
  const heroImageUrl = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop';

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 py-24 sm:py-32 lg:py-40 border-b border-slate-800/50 bg-scroll sm:bg-fixed"
        style={{
          backgroundImage: `url(${heroImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/90 to-slate-950/85 z-10" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="inline-block bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-xs font-semibold border border-blue-500/30 backdrop-blur-sm hover:bg-blue-500/15 transition-all duration-200">
                  Welcome to Talynk
                </div>
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-tight">
                  Connect <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Talent</span> with
                  <br />
                  <span className="text-slate-300">Opportunity</span>
                </h1>
              </div>

              <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                Intelligent talent matching platform connecting creative professionals with inspiring opportunities. 
                Upload your portfolio, get classified, and connect with the right collaborators.
              </p>

              <div className="flex flex-wrap gap-4 pt-6">
                <Link
                  href="/auth/signup?role=talent"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 group hover:scale-105"
                >
                  I'm a Talent
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/auth/signup?role=sponsor"
                  className="inline-flex items-center justify-center px-8 py-4 bg-slate-800/50 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all duration-300 backdrop-blur-sm hover:border-slate-600 hover:shadow-lg"
                >
                  I'm a Sponsor
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-700/30">
                <div className="group">
                  <p className="text-3xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">500+</p>
                  <p className="text-sm text-slate-400 mt-2 uppercase tracking-wide">Active Talents</p>
                </div>
                <div className="group">
                  <p className="text-3xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors">200+</p>
                  <p className="text-sm text-slate-400 mt-2 uppercase tracking-wide">Companies</p>
                </div>
                <div className="group">
                  <p className="text-3xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">10k+</p>
                  <p className="text-sm text-slate-400 mt-2 uppercase tracking-wide">Matches</p>
                </div>
              </div>
            </div>

            {/* Right - Hero Graphic */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="w-full h-96 rounded-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300 shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                  alt="Creative collaboration"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 sm:py-32 lg:py-40 bg-slate-900 border-t border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              How It <span className="text-blue-400">Works</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Simple, fast, and powerful. Get matched with opportunities in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: 'Upload Portfolio',
                description: 'Share your best work - images, videos, audio, and documents',
                number: '01',
              },
              {
                icon: Users,
                title: 'Get Classified',
                description: 'Your work is categorized into one of 8 creative sectors',
                number: '02',
              },
              {
                icon: Zap,
                title: 'Get Matched',
                description: 'Connect with companies actively looking for your expertise',
                number: '03',
              },
            ].map((step, idx) => (
              <div key={idx} className="relative group h-full animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700/50 rounded-2xl p-8 h-full hover:border-blue-500/50 hover:bg-slate-800/30 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="text-6xl font-bold text-slate-700 mb-6 opacity-50">{step.number}</div>
                  <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all duration-300">
                    <step.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 sm:py-32 lg:py-40 bg-slate-950 border-t border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Why <span className="text-amber-400">Talynk</span>?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Built for creators and companies who deserve better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast Matching',
                description: 'Smart matching in seconds, not weeks. Get discovered by companies actively seeking talent.',
              },
              {
                icon: Users,
                title: 'Sector-Focused',
                description: 'Talents are matched with companies interested in their specific creative field.',
              },
              {
                icon: Shield,
                title: 'Your Work Protected',
                description: 'Your portfolio stays yours. We only share what you authorize us to share.',
              },
              {
                icon: Eye,
                title: 'Track Opportunities',
                description: 'See who viewed your work, and manage all opportunities in one centralized dashboard.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group flex gap-6 p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/30 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white mb-2 leading-tight">{feature.title}</h3>
                  <p className="text-slate-400 text-base leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Ready to <span className="text-blue-400">Connect</span>?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Join creative professionals and leading companies already building opportunities through Talynk.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/talents"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-105 group"
              >
                Explore Talents
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-800/50 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all duration-300 backdrop-blur-sm hover:border-slate-600 hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Explore All Pages Section */}
      <section className="py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Explore <span className="text-amber-400">Everything</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Navigate through all pages and features of Talynk in one central location.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Link
                href="/sitemap"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 hover:border-amber-500/50 hover:bg-slate-800/30 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-amber-500/10"
              >
                <div className="relative z-10">
                  <div className="inline-block mb-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 transition-all duration-300">
                      <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6h6m-6 6h6m-6 6h6M3 6h.01M3 12h.01M3 18h.01" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">Site Map</h3>
                  <p className="text-slate-400 text-base leading-relaxed mb-4">
                    Complete directory of all pages, sections, and features available on Talynk.
                  </p>
                  <div className="inline-flex items-center gap-2 text-amber-400 font-semibold group-hover:gap-3 transition-all">
                    Explore Map
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>

              <Link
                href="/talents"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 hover:border-blue-500/50 hover:bg-slate-800/30 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="relative z-10">
                  <div className="inline-block mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all duration-300">
                      <Users className="w-7 h-7 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Talents Directory</h3>
                  <p className="text-slate-400 text-base leading-relaxed mb-4">
                    Browse and discover talented professionals across all creative sectors.
                  </p>
                  <div className="inline-flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all">
                    Discover Talents
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </div>

            <div className="text-center">
              <p className="text-slate-400 text-sm mb-6">Quick access to main sections</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/explore" className="px-6 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 hover:border-slate-600 font-medium">
                  Explore
                </Link>
                <Link href="/search" className="px-6 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 hover:border-slate-600 font-medium">
                  Search
                </Link>
                <Link href="/trending" className="px-6 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 hover:border-slate-600 font-medium">
                  Trending
                </Link>
                <Link href="/sponsors" className="px-6 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 hover:border-slate-600 font-medium">
                  Sponsors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
