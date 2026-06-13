'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Heart, Zap, Users, Award, TrendingUp, Lightbulb } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    name: 'Sarah Johnson',
    role: 'Founder & CEO',
    bio: 'Former creative director with 15+ years in the industry',
  },
  {
    name: 'Marcus Lee',
    role: 'CTO',
    bio: 'AI/ML specialist passionate about technology for good',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Head of Community',
    bio: 'Community builder connecting creators worldwide',
  },
  {
    name: 'David Chen',
    role: 'VP of Design',
    bio: 'UX/UI expert focused on inclusive design',
  },
];

const VALUES = [
  {
    icon: Heart,
    title: 'Passion First',
    description: 'We celebrate creativity and the dedication it takes to master a craft.',
  },
  {
    icon: Zap,
    title: 'Empowerment',
    description: 'We give talented creators the tools and platform to succeed.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We build genuine connections between creators and companies.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We leverage AI to make matching smarter and faster.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="bg-slate-950 py-20 sm:py-28 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our Mission
            </h1>
            <p className="text-xl text-slate-400 mb-8">
              To empower creative talent and connect them with opportunities that fuel their passion and growth.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/talents"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all"
              >
                Browse Talents
              </Link>
              <Link
                href="/sponsors"
                className="inline-flex items-center justify-center px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg border border-slate-700 transition-all"
              >
                Browse Sponsors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 sm:py-28 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-400 text-lg">
                <p>
                  Talynk was born from a simple observation: incredible creative talent was struggling to connect with companies actively seeking their unique skills.
                </p>
                <p>
                  Founded in 2024, our platform uses AI to automatically match talented creators with sponsors interested in their specific field. No more endless scrolling. No more missed opportunities.
                </p>
                <p>
                  We believe everyone deserves a chance to showcase their work to the right audience. That's why we built Talynk.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-2xl group">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                alt="Our creative vision"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { label: '500+', title: 'Active Talents', icon: Users },
              { label: '200+', title: 'Partner Companies', icon: TrendingUp },
              { label: '10k+', title: 'Successful Matches', icon: Award },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-4xl font-bold text-white mb-2">{stat.label}</p>
                <p className="text-slate-400">{stat.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-28 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-slate-400">What drives everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, idx) => (
              <div
                key={idx}
                className="bg-slate-800 border border-slate-700 p-8 rounded-xl hover:border-blue-500 hover:bg-slate-700/50 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{value.title}</h3>
                <p className="text-sm text-slate-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 sm:py-28 bg-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Team</h2>
            <p className="text-xl text-slate-400">Passionate people building the future</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member, idx) => {
              // Use static avatar image URLs
              const avatarUrls = [
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1507003211512-0adeab1e2e93?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1500482074141-c7de2d8b6ecf?w=400&h=400&fit=crop',
              ];
              return (
                <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/50 hover:bg-slate-700/50 transition-all group">
                  <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
                    <img
                      src={avatarUrls[idx]}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-800 to-transparent" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-lg text-white mb-1">{member.name}</h3>
                    <p className="text-sm text-blue-400 font-semibold mb-3">{member.role}</p>
                    <p className="text-sm text-slate-400">{member.bio}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Join?</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Whether you're a creative professional or a company looking for talent, Talynk is your platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/auth/signup?role=talent"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all"
            >
              I'm a Talent
            </Link>
            <Link
              href="/auth/signup?role=sponsor"
              className="inline-flex items-center justify-center px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg border border-slate-700 transition-all"
            >
              I'm a Sponsor
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
