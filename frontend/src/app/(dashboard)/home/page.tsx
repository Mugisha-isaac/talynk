// src/app/(dashboard)/home/page.tsx
'use client';

import React, { useState } from 'react';
import { FeedLayout } from '@/components/FeedLayout';
import { MediaCard } from '@/components/MediaCard';
import { CreatorCard } from '@/components/CreatorCard';
import { AIRecommendationCard } from '@/components/AIRecommendationCard';
import { Button } from '@/components/common/Button';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';

// Mock data
const mockRecommendations = [
  {
    id: '1',
    title: 'Emerging Rwandan Musician',
    subtitle: 'Perfect for your music label',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
    matchScore: 94,
    reason: 'Their Afrobeats style matches your recent playlist preferences perfectly',
    factors: [
      { label: 'Genre Match', value: 98 },
      { label: 'Engagement Rate', value: 87 },
      { label: 'Audience Demographics', value: 92 },
      { label: 'Growth Trajectory', value: 85 },
    ],
  },
];

const mockTrending = [
  {
    id: '1',
    title: 'Contemporary Dance Showcase',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1484318471464-feca0be6d4ee?w=300&h=300&fit=crop',
    type: 'VIDEO' as const,
    category: 'Dance',
    creatorName: 'Amara Movements',
    creatorAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    creatorId: 'creator-1',
    likes: 45200,
    comments: 3400,
    shares: 2100,
  },
  {
    id: '2',
    title: 'Afrobeats Production Tips',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    type: 'VIDEO' as const,
    category: 'Music',
    creatorName: 'DJ Kigali',
    creatorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    creatorId: 'creator-2',
    likes: 32100,
    comments: 2200,
    shares: 1800,
  },
];

const mockFeaturedCreators = [
  {
    id: 'creator-1',
    name: 'Amara Movements',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    category: 'Choreography',
    verified: true,
    followers: 125400,
    engagementRate: 8.2,
    visibilityScore: 92,
  },
];

export default function HomePage() {
  const [currentRecommendationIndex, setCurrentRecommendationIndex] = useState(0);

  const handleSkipRecommendation = () => {
    setCurrentRecommendationIndex(
      (prev) => (prev + 1) % mockRecommendations.length
    );
  };

  const renderSidebar = () => (
    <>
      <div className="rounded-2xl bg-card/80 backdrop-blur-md border border-white/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Trending Now</h2>
        </div>

        <div className="space-y-4">
          {mockTrending.map((item) => (
            <a key={item.id} href={`/talents/${item.creatorId}`} className="block group">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">{item.creatorName}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <Button variant="secondary" className="w-full mt-4">
          View All Trending
        </Button>
      </div>
    </>
  );

  return (
    <FeedLayout sidebarContent={renderSidebar()}>
      {/* AI Recommendations */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">AI-Powered Recommendations</h2>
        </div>

        <AIRecommendationCard
          {...mockRecommendations[currentRecommendationIndex]}
          onAccept={() => {}}
          onReject={handleSkipRecommendation}
          isPriority
        />
      </div>

      {/* Trending Media */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-white">Trending Now</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockTrending.map((item) => (
            <MediaCard key={item.id} {...item} variant="featured" />
          ))}
        </div>

        <Button variant="secondary" className="w-full mt-6">
          View All Trending
        </Button>
      </div>

      {/* Featured Creators */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Featured Creators</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockFeaturedCreators.map((creator) => (
            <CreatorCard key={creator.id} {...creator} />
          ))}
        </div>
      </div>
    </FeedLayout>
  );
}
