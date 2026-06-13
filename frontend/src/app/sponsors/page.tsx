'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ModernSponsorCard } from '@/components/ModernSponsorCard';
import { Input } from '@/components/ui/input';
import { Search, Sliders } from 'lucide-react';

const SECTORS = [
  'Visual Arts',
  'Photography',
  'Design',
  'Music',
  'Film & Video',
  'Fashion',
  'Performance & Theater',
  'Sports',
];

// Curated Unsplash photo IDs for sponsor/company showcase images
const sponsorPhotoIds = [
  '1552664730-d307ca884978', // Corporate
  '1454165804606', // Business environment
  '1516534775068', // Collaboration
  '1507238691413', // Team collaboration
  '1552664730-9f0cfe5f87a1', // Business
  '1552664730-d307ca884978', // Office space
  '1507003211169', // Professional environment
  '1517694712202', // Creative office
];

const SAMPLE_SPONSORS = [
  {
    id: '1',
    name: 'Creative Director',
    company: 'Adobe Creative Studios',
    bio: 'We are looking for exceptional creative talent to collaborate on cutting-edge digital projects',
    sectors: ['Design', 'Photography', 'Film & Video'],
    talentCount: 12,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Head of Production',
    company: 'Netflix Productions',
    bio: 'Seeking talented filmmakers and visual artists for exclusive content production',
    sectors: ['Film & Video', 'Visual Arts'],
    talentCount: 28,
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Music Label Director',
    company: 'Universal Music Group',
    bio: 'Discovering and supporting emerging musicians across all genres',
    sectors: ['Music', 'Performance & Theater'],
    talentCount: 45,
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Fashion Director',
    company: 'Vogue Fashion',
    bio: 'Collaborating with innovative designers to create stunning fashion campaigns',
    sectors: ['Fashion', 'Photography', 'Design'],
    talentCount: 18,
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Creative Lead',
    company: 'Google Design',
    bio: 'Building world-class design experiences with talented designers and artists',
    sectors: ['Design', 'Visual Arts'],
    talentCount: 22,
    rating: 4.8,
  },
  {
    id: '6',
    name: 'Content Manager',
    company: 'ESPN Sports Network',
    bio: 'Creating engaging sports content with talented creators and athletes',
    sectors: ['Sports', 'Film & Video'],
    talentCount: 15,
    rating: 4.5,
  },
  {
    id: '7',
    name: 'Producer',
    company: 'Sony Music Entertainment',
    bio: 'Producing and promoting exceptional musical talent worldwide',
    sectors: ['Music', 'Film & Video'],
    talentCount: 35,
    rating: 4.7,
  },
  {
    id: '8',
    name: 'Exhibition Curator',
    company: 'MoMA Contemporary Art',
    bio: 'Showcasing innovative contemporary art and visual artists',
    sectors: ['Visual Arts', 'Photography'],
    talentCount: 8,
    rating: 4.9,
  },
];

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState(SAMPLE_SPONSORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  useEffect(() => {
    let filtered = SAMPLE_SPONSORS;

    if (searchQuery) {
      filtered = filtered.filter(
        (sponsor) =>
          sponsor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sponsor.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSector) {
      filtered = filtered.filter((sponsor) =>
        sponsor.sectors.includes(selectedSector)
      );
    }

    setSponsors(filtered);
  }, [searchQuery, selectedSector]);

  return (
    <div className="bg-slate-950 min-h-screen">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-20 sm:py-24 border-b border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-4 leading-tight">
            Companies & <span className="text-blue-400">Sponsors</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Discover leading companies looking for creative talent
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-6 border-b border-slate-800/50 sticky top-16 z-30 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="text"
                placeholder="Search companies by name or role..."
                className="pl-12 pr-4 h-12 bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-blue-500 rounded-lg transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sector Filter */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Filter by Sector Interest</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedSector(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm border ${
                    selectedSector === null
                      ? 'bg-blue-500 text-white border-blue-400'
                      : 'bg-slate-800/50 text-slate-300 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  All Sectors
                </button>
                {SECTORS.map((sector) => (
                  <button
                    key={sector}
                    onClick={() => setSelectedSector(sector)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm border ${
                      selectedSector === sector
                        ? 'bg-blue-500 text-white border-blue-400'
                        : 'bg-slate-800/50 text-slate-300 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Grid */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {sponsors.length > 0 ? (
            <>
              <p className="text-sm text-slate-500 mb-8 font-medium uppercase tracking-wide">
                Showing {sponsors.length} of {SAMPLE_SPONSORS.length} companies
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
                {sponsors.map((sponsor, index) => (
                  <ModernSponsorCard
                    key={sponsor.id}
                    id={sponsor.id}
                    name={sponsor.company}
                    category={sponsor.sectors.join(', ')}
                    image={`https://images.unsplash.com/photo-${sponsorPhotoIds[index % sponsorPhotoIds.length]}?w=500&h=500&fit=crop`}
                    budget="$10K - $100K"
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <Search className="w-16 h-16 text-slate-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-3">No companies found</h3>
              <p className="text-slate-400 mb-8 text-lg">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSector(null);
                }}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
