'use client';

import React, { useState } from 'react';
import { PageLayout, PageHeader } from '@/components/layout/AdvancedLayouts';
import { CreatorCard } from '@/components/cards/AdvancedCards';
import { Skeleton } from '@/components/common/AdvancedCommon';
import { Zap, Trophy, TrendingUp } from 'lucide-react';

// Curated Unsplash photo IDs for diverse profile avatars
const profilePhotoIds = [
  '1494790108377', // Professional headshot
  '1507003211169', // Modern professional
  '1500482074141', // Creative professional
  '1507003211512', // Diverse professional
  '1520227881592', // Professional portrait
  '1506157786151', // Creative energy
  '1535016120894', // Artistic professional
  '1516738901601', // Creative workspace
  '1519671482677', // Professional
  '1517841905566', // Modern professional
  '1438761681033', // Creative workspace
  '1502920917128', // Professional setup
];

// Mock trending creators
const trendingCreators = Array(12)
  .fill(0)
  .map((_, i) => ({
    id: `trending-${i}`,
    name: `Trending Creator ${i + 1}`,
    avatar: `https://images.unsplash.com/photo-${profilePhotoIds[i]}?w=400&h=400&fit=crop&crop=faces`,
    category: ['Music', 'Comedy', 'Dance', 'Art', 'Sports'][i % 5],
    followers: Math.floor(Math.random() * 100000) + 10000,
    engagement: Math.random() * 5 + 5,
    aiScore: Math.floor(Math.random() * 20) + 80,
    isVerified: i % 3 === 0,
    isTrending: true,
  }));

/**
 * Trending Page
 * Real-time trending creators with momentum metrics
 */
export default function TrendingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('today');

  return (
    <PageLayout maxWidth="2xl">
      {/* Page Header */}
      <PageHeader
        title="Trending Now"
        subtitle="The hottest creators on Talynk right now"
        action={{
          label: 'Refresh',
          onClick: () => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          },
        }}
      />

      {/* Timeframe Selector */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {[
          { id: 'today', label: '📅 Today' },
          { id: 'week', label: '📊 This Week' },
          { id: 'month', label: '📈 This Month' },
          { id: 'alltime', label: '🏆 All Time' },
        ].map((option) => (
          <button
            key={option.id}
            onClick={() => setTimeframe(option.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              timeframe === option.id
                ? 'bg-gradient-to-r from-primary-blue to-primary-purple text-white'
                : 'bg-bg-medium text-text-secondary hover:text-text-primary'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: <Zap className="w-6 h-6" />,
            label: 'Peak Engagement',
            value: '24.5%',
            color: 'from-accent-orange/20 to-accent-orange/5',
          },
          {
            icon: <TrendingUp className="w-6 h-6" />,
            label: 'Growth Rate',
            value: '+12.3%',
            color: 'from-green-500/20 to-green-500/5',
          },
          {
            icon: <Trophy className="w-6 h-6" />,
            label: 'Total Views',
            value: '2.4M+',
            color: 'from-accent-gold/20 to-accent-gold/5',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-6 rounded-xl border border-border-medium bg-gradient-to-br ${stat.color}`}
          >
            <div className="flex items-center gap-3 mb-2">
              {stat.icon}
              <h3 className="text-text-secondary text-sm font-medium">{stat.label}</h3>
            </div>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Trending Creators Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(9)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} variant="card" />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingCreators.map((creator, idx) => (
            <div key={creator.id} className="relative">
              {/* Rank Badge */}
              <div className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-gradient-to-br from-accent-gold to-accent-orange flex items-center justify-center">
                <span className="text-white font-bold text-sm">#{idx + 1}</span>
              </div>
              <CreatorCard {...creator} />
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {!isLoading && (
        <button className="w-full mt-8 py-3 rounded-lg border border-border-medium text-text-secondary hover:text-text-primary hover:border-primary-blue transition-all duration-200 font-medium">
          Load More Trending Creators
        </button>
      )}
    </PageLayout>
  );
}
