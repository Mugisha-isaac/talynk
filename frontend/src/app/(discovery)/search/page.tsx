'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageLayout, PageHeader } from '@/components/layout/AdvancedLayouts';
import { SearchBar } from '@/components/discovery/SearchAndFilter';
import { CreatorCard, ContentCard } from '@/components/cards/AdvancedCards';
import { Tabs } from '@/components/common/AdvancedCommon';
import { AlertCircle } from 'lucide-react';

/**
 * Search Page Content Component
 */
function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [, setActiveTab] = useState('creators');

  // Curated Unsplash photo IDs for profile avatars
  const profilePhotoIds = [
    '1494790108377', // Professional headshot
    '1507003211169', // Modern professional
    '1500482074141', // Creative professional
    '1507003211512', // Diverse professional
    '1520227881592', // Professional portrait
    '1506157786151', // Creative energy
  ];

  // Curated Unsplash photo IDs for content thumbnails
  const contentPhotoIds = [
    '1506157786151', // DJ Equipment
    '1493225457519', // Recording Studio
    '1470225620905', // Music Producer
    '1535016120894', // Artist at Work
    '1516738901601', // Creator workspace
    '1506372991129', // Creative setup
    '1484807550052', // Photographer
    '1502920917128', // Camera equipment
    '1612198188060', // Video production
  ];

  const mockCreators = Array(6)
    .fill(0)
    .map((_, i) => ({
      id: `creator-${i}`,
      name: `Creator ${i + 1}`,
      avatar: `https://images.unsplash.com/photo-${profilePhotoIds[i]}?w=400&h=400&fit=crop&crop=faces`,
      category: ['Music', 'Comedy', 'Dance', 'Art'][i % 4],
      followers: Math.floor(Math.random() * 50000) + 5000,
      engagement: Math.random() * 5 + 5,
      aiScore: Math.floor(Math.random() * 20) + 80,
      isVerified: i % 2 === 0,
    }));

  const mockContent = Array(9)
    .fill(0)
    .map((_, i) => ({
      id: `content-${i}`,
      title: `Content ${i + 1}`,
      thumbnail: `https://images.unsplash.com/photo-${contentPhotoIds[i]}?w=400&h=300&fit=crop`,
      creator: { name: `Creator ${i % 3}`, avatar: `https://images.unsplash.com/photo-${profilePhotoIds[i % 6]}?w=100&h=100&fit=crop&crop=faces` },
      type: ['video', 'image', 'audio'][i % 3] as 'video' | 'image' | 'audio',
      duration: '2:34',
      views: Math.floor(Math.random() * 50000),
      likes: Math.floor(Math.random() * 5000),
      comments: Math.floor(Math.random() * 500),
    }));

  const tabs = [
    {
      id: 'creators',
      label: '👥 Creators',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCreators.map((creator) => (
            <CreatorCard key={creator.id} {...creator} />
          ))}
        </div>
      ),
    },
    {
      id: 'content',
      label: '🎬 Content',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockContent.map((content) => (
            <ContentCard key={content.id} {...content} />
          ))}
        </div>
      ),
    },
    {
      id: 'tags',
      label: '#️⃣ Tags',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['#music', '#dance', '#comedy', '#art', '#rwanda', '#africa'].map((tag) => (
            <button
              key={tag}
              className="p-4 rounded-lg border border-border-medium hover:border-primary-blue/50 hover:bg-bg-medium transition-all duration-200 text-left"
            >
              <p className="font-semibold text-text-primary mb-1">{tag}</p>
              <p className="text-text-tertiary text-sm">2.5K posts</p>
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <PageLayout maxWidth="2xl">
      {/* Page Header */}
      <PageHeader
        title="Search"
        subtitle={query ? `Results for "${query}"` : 'Search creators and content'}
      />

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          placeholder="Search creators, tags, or content..."
          onSearch={setQuery}
          suggestions={['Amara Okonkwo', 'Music', 'Rwanda', 'Dance', 'Comedy']}
        />
      </div>

      {/* No Results */}
      {!query && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="w-16 h-16 text-text-tertiary mb-4" />
          <h3 className="text-xl font-bold text-text-primary mb-2">Start Searching</h3>
          <p className="text-text-secondary max-w-sm">
            Enter a creator name, tag, or keyword to find amazing talent
          </p>
        </div>
      )}

      {/* Results */}
      {query && (
        <Tabs
          tabs={tabs}
          defaultTab="creators"
          onChange={setActiveTab}
        />
      )}
    </PageLayout>
  );
}

/**
 * Main Search Page with Suspense boundary
 */
export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
