'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ModernTalentCard } from '@/components/ModernTalentCard';
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

// Curated Unsplash photo IDs for talent showcase images
const talentPhotoIds = [
  '1484807550052', // Photographer
  '1561070791-2526d30994b5', // Designer
  '1493225457519', // Recording Studio
  '1502920917128', // Camera equipment
  '1535016120894', // Artist at work
  '1595938894655', // Fashion model
  '1495379957154', // Performance stage
  '1517836357207', // Athlete
];

const SAMPLE_TALENTS = [
  {
    id: '1',
    name: 'Sarah Anderson',
    bio: 'Professional photographer specializing in portrait and landscape photography with 10+ years experience',
    sector: 'Photography',
    portfolioCount: 24,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    bio: 'Creative director and graphic designer passionate about brand identity and visual storytelling',
    sector: 'Design',
    portfolioCount: 18,
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    bio: 'Musician and composer specializing in indie pop and electronic music production',
    sector: 'Music',
    portfolioCount: 32,
  },
  {
    id: '4',
    name: 'David Chen',
    bio: 'Filmmaker creating cinematic content for commercials and independent films',
    sector: 'Film & Video',
    portfolioCount: 15,
  },
  {
    id: '5',
    name: 'Jessica Williams',
    bio: 'Fashion designer with collections focused on sustainable and ethical production',
    sector: 'Fashion',
    portfolioCount: 28,
  },
  {
    id: '6',
    name: 'Alex Thompson',
    bio: 'Visual artist exploring contemporary abstract and mixed media techniques',
    sector: 'Visual Arts',
    portfolioCount: 21,
  },
  {
    id: '7',
    name: 'Priya Patel',
    bio: 'Professional dancer and choreographer specialized in contemporary and fusion styles',
    sector: 'Performance & Theater',
    portfolioCount: 19,
  },
  {
    id: '8',
    name: 'Chris Martin',
    bio: 'Sports content creator producing athletic training and motivational videos',
    sector: 'Sports',
    portfolioCount: 26,
  },
];

export default function TalentsPage() {
  const [talents, setTalents] = useState(SAMPLE_TALENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  useEffect(() => {
    let filtered = SAMPLE_TALENTS;

    if (searchQuery) {
      filtered = filtered.filter(
        (talent) =>
          talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          talent.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSector) {
      filtered = filtered.filter((talent) => talent.sector === selectedSector);
    }

    setTalents(filtered);
  }, [searchQuery, selectedSector]);

  return (
    <div className="bg-slate-950 min-h-screen">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-20 sm:py-24 border-b border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-4 leading-tight">
            Browse Talented <span className="text-blue-400">Creators</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Discover exceptional talent across 8 creative sectors
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
                placeholder="Search talents by name or skill..."
                className="pl-12 pr-4 h-12 bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-blue-500 rounded-lg transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sector Filter */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Filter by Sector</span>
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

      {/* Talents Grid */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {talents.length > 0 ? (
            <>
              <p className="text-sm text-slate-500 mb-8 font-medium uppercase tracking-wide">
                Showing {talents.length} of {SAMPLE_TALENTS.length} talents
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
                {talents.map((talent, index) => (
                  <ModernTalentCard
                    key={talent.id}
                    id={talent.id}
                    name={talent.name}
                    category={talent.sector}
                    image={`https://images.unsplash.com/photo-${talentPhotoIds[index % talentPhotoIds.length]}?w=500&h=500&fit=crop`}
                    rating={4.5}
                    views={1200}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <Search className="w-16 h-16 text-slate-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-3">No talents found</h3>
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
