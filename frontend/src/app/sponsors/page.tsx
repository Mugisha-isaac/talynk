'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ModernTalentCard } from '@/components/ModernTalentCard';
import { Input } from '@/components/ui/input';
import { Search, Sliders } from 'lucide-react';
import { SECTOR_CATEGORIES } from '@/types';

const SECTORS = SECTOR_CATEGORIES;

interface TalentCardVM {
  id: string;
  name: string;
  category: string;
  image: string;
  visibilityScore?: number;
}

export default function SponsorsPage() {
  const [talents, setTalents] = useState<TalentCardVM[]>([]);
  const [topTalents, setTopTalents] = useState<TalentCardVM[]>([]);
  const [topLoading, setTopLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Top 5 recommended talents overall, ranked by their ML-evaluated
  // visibility score (Creator.visibilityScoreCurrent, kept in sync whenever
  // a talent uploads new media). Shown before the sponsor picks a sector.
  useEffect(() => {
    const controller = new AbortController();

    const loadTopTalents = async () => {
      try {
        setTopLoading(true);
        const response = await fetch('/api/talents?page=1&limit=5', {
          signal: controller.signal,
        });
        if (!response.ok) {
          setTopTalents([]);
          return;
        }
        const result = await response.json();
        const mapped: TalentCardVM[] = (result.data || []).map((talent: any) => ({
          id: talent.id,
          name: talent.name,
          category: talent.categoryLabel || talent.category,
          image:
            talent.avatar ||
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
          visibilityScore: talent.visibilityScore,
        }));
        setTopTalents(mapped);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Failed to fetch top talents:', error);
        }
      } finally {
        setTopLoading(false);
      }
    };

    loadTopTalents();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedSector) {
      setTalents([]);
      return;
    }

    const controller = new AbortController();

    const loadTalents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          category: selectedSector,
          page: '1',
          limit: '50',
        });

        if (searchQuery.trim()) {
          params.set('search', searchQuery.trim());
        }

        const response = await fetch(`/api/talents?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setTalents([]);
          return;
        }

        const result = await response.json();
        const mapped: TalentCardVM[] = (result.data || []).map((talent: any) => ({
          id: talent.id,
          name: talent.name,
          category: talent.categoryLabel || talent.category,
          image:
            talent.avatar ||
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        }));

        setTalents(mapped);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Failed to fetch talents by sector:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTalents();

    return () => controller.abort();
  }, [selectedSector, searchQuery]);

  const selectedSectorLabel = selectedSector
    ? SECTORS.find((sector) => sector.id === selectedSector)?.label
    : null;

  return (
    <div className="bg-slate-950 min-h-screen">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-20 sm:py-24 border-b border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-4 leading-tight">
            Sponsor <span className="text-blue-400">Discovery</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Select a sector to discover the strongest creator matches
          </p>
        </div>
      </section>

      {/* Top 5 Recommended Talents (ML-scored, overall) */}
      <section className="py-12 sm:py-16 border-b border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Top 5 Recommended Talents
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Ranked by ML-evaluated visibility score across all sectors
          </p>

          {topLoading ? (
            <div className="text-slate-400 py-8">Loading recommendations...</div>
          ) : topTalents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {topTalents.map((talent, index) => (
                <div key={talent.id} className="relative">
                  <span className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center border-2 border-slate-950">
                    {index + 1}
                  </span>
                  <ModernTalentCard
                    id={talent.id}
                    name={talent.name}
                    category={talent.category}
                    image={talent.image}
                    rating={4.5}
                    views={1200}
                  />
                  {typeof talent.visibilityScore === 'number' && (
                    <p className="text-xs text-blue-400 mt-1 font-medium">
                      Score: {Math.round(talent.visibilityScore)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 py-8">
              No scored talents yet. Recommendations will appear once talents upload portfolio media.
            </div>
          )}
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
                <span className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Available Sectors</span>
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
                  Choose Later
                </button>
                {SECTORS.map((sector) => (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm border ${
                      selectedSector === sector.id
                        ? 'bg-blue-500 text-white border-blue-400'
                        : 'bg-slate-800/50 text-slate-300 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    {sector.icon} {sector.label}
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
          {!selectedSector ? (
            <div className="text-center py-24">
              <Sliders className="w-16 h-16 text-slate-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-3">
                Select a sector to view talents
              </h3>
              <p className="text-slate-400 text-lg">
                Pick any sector above to load matching talents
              </p>
            </div>
          ) : loading ? (
            <div className="text-center py-24 text-slate-400 text-lg">
              Loading talents for {selectedSectorLabel || selectedSector}...
            </div>
          ) : talents.length > 0 ? (
            <>
              <p className="text-sm text-slate-500 mb-8 font-medium uppercase tracking-wide">
                Showing {talents.length} talent{talents.length === 1 ? '' : 's'} in {selectedSectorLabel || selectedSector}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
                {talents.map((talent) => (
                  <ModernTalentCard
                    key={talent.id}
                    id={talent.id}
                    name={talent.name}
                    category={talent.category}
                    image={talent.image}
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
                No talents currently match {selectedSectorLabel || selectedSector}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                }}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
