'use client';

import React, { useState } from 'react';
import { PageLayout, PageHeader } from '@/components/layout/AdvancedLayouts';
import {
  SearchBar,
  FilterPanel,
  CategoryFilter,
  SortDropdown,
} from '@/components/discovery/SearchAndFilter';
import { CreatorCard } from '@/components/cards/AdvancedCards';
import { Skeleton } from '@/components/common/AdvancedCommon';
import { Music, Mic2, Users, Palette, Zap, Trophy } from 'lucide-react';

// Mock data
const mockCreators = [
  {
    id: '1',
    name: 'Amara Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    category: 'Singer',
    followers: 45200,
    engagement: 8.5,
    aiScore: 92,
    isVerified: true,
    isTrending: true,
    bio: 'RwandanArtist - Afrobeats & Soul Music',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
  },
  {
    id: '2',
    name: 'Karim Hassan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    category: 'Comedian',
    followers: 32100,
    engagement: 6.2,
    aiScore: 88,
    isVerified: true,
    bio: 'Comedy content from East Africa',
    imageUrl: 'https://images.unsplash.com/photo-1535016120754-fd58615b0787?w=800',
  },
  {
    id: '3',
    name: 'Zara Kimani',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    category: 'Dancer',
    followers: 67800,
    engagement: 9.1,
    aiScore: 95,
    isVerified: true,
    isTrending: true,
    bio: 'Contemporary African dance',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  },
  {
    id: '4',
    name: 'James Okoro',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    category: 'Visual Artist',
    followers: 28900,
    engagement: 7.3,
    aiScore: 87,
    bio: 'Digital art & illustration',
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd2cecdf8a8b?w=800',
  },
];

const categories = [
  { id: 'music', name: 'Music', icon: <Music className="w-4 h-4" />, count: 1240 },
  { id: 'comedy', name: 'Comedy', icon: <Mic2 className="w-4 h-4" />, count: 856 },
  { id: 'dance', name: 'Dance', icon: <Users className="w-4 h-4" />, count: 2104 },
  { id: 'art', name: 'Visual Art', icon: <Palette className="w-4 h-4" />, count: 1532 },
  { id: 'sports', name: 'Sports', icon: <Trophy className="w-4 h-4" />, count: 943 },
  { id: 'content', name: 'Content Creator', icon: <Zap className="w-4 h-4" />, count: 3201 },
];

const sortOptions = [
  { id: 'trending', label: '🔥 Trending Now' },
  { id: 'new', label: '✨ New Creators' },
  { id: 'followers', label: '👥 Most Followed' },
  { id: 'engagement', label: '💬 Highest Engagement' },
  { id: 'nearby', label: '📍 Near Me' },
];

const filterOptions = {
  verification: [
    { id: 'verified', label: 'Verified Only', count: 4200, checked: false },
    { id: 'all', label: 'All Creators', count: 12500, checked: true },
  ],
  followers: [
    { id: '10k', label: '10K+ Followers', count: 3200, checked: false },
    { id: '50k', label: '50K+ Followers', count: 1200, checked: false },
    { id: '100k', label: '100K+ Followers', count: 340, checked: false },
    { id: 'all_followers', label: 'All', count: 12500, checked: true },
  ],
  engagement: [
    { id: 'high', label: 'High (7%+)', count: 2100, checked: false },
    { id: 'medium', label: 'Medium (3-7%)', count: 5600, checked: false },
    { id: 'low', label: 'Low (<3%)', count: 4800, checked: false },
    { id: 'all_eng', label: 'All', count: 12500, checked: true },
  ],
};

/**
 * Explore Page
 * Discover and filter creators across the platform
 * Features:
 * - Category browsing
 * - Advanced filtering
 * - Sorting options
 * - Smart search
 */
export default function ExplorePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState('trending');
  const [filters, setFilters] = useState(filterOptions);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId]
    );
  };

  const handleFilterChange = (filterName: string, optionId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: prev[filterName as keyof typeof filters].map((option) =>
        option.id === optionId ? { ...option, checked } : option
      ),
    }));
  };

  const handleSearch = (_query: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <PageLayout maxWidth="2xl">
      {/* Page Header */}
      <PageHeader
        title="Discover Talent"
        subtitle="Find amazing creators across Africa"
      />

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          placeholder="Search creators, tags, or content..."
          onSearch={handleSearch}
          suggestions={['Amara Okonkwo', 'Music', 'Comedy', 'Dance', 'Rwanda']}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          {/* Categories */}
          <div className="mb-8 pb-8 border-b border-border-medium">
            <h3 className="font-semibold text-text-primary mb-4">Categories</h3>
            <CategoryFilter
              categories={categories}
              selected={selectedCategories}
              onSelect={handleCategorySelect}
              variant="button"
            />
          </div>

          {/* Advanced Filters */}
          <h3 className="font-semibold text-text-primary mb-4">Filter</h3>
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Sort and View Options */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="text-text-secondary text-sm">
              Showing <span className="font-semibold text-text-primary">
                {isLoading ? '...' : '12'}
              </span> creators
            </div>
            <SortDropdown
              options={sortOptions}
              value={selectedSort}
              onChange={setSelectedSort}
            />
          </div>

          {/* Creators Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} variant="card" />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockCreators.map((creator) => (
                <CreatorCard key={creator.id} {...creator} />
              ))}
            </div>
          )}

          {/* Load More */}
          {!isLoading && (
            <button className="w-full mt-8 py-3 rounded-lg border border-border-medium text-text-secondary hover:text-text-primary hover:border-primary-blue transition-all duration-200 font-medium">
              Load More Creators
            </button>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
