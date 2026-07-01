"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ModernTalentCard } from "@/components/ModernTalentCard";
import { Input } from "@/components/ui/input";
import { Search, Sliders, Plus } from "lucide-react";
import { UserRole } from "@/types";

import { SECTOR_CATEGORIES } from "@/types";

const SECTORS = SECTOR_CATEGORIES; // [{ id, label, icon, color, discipline }]


interface TalentVM {
  id: string;
  name: string;
  bio: string;
  sector: string;
  portfolioCount: number;
  imageUrl: string;
}

export default function TalentsPage() {
  const [talents, setTalents] = useState<TalentVM[]>([]);
  const [myUploads, setMyUploads] = useState<TalentVM[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  const isCreatorView = role === UserRole.TALENT;

  useEffect(() => {
    const controller = new AbortController();

    const loadRoleAndCreatorContent = async () => {
      try {
        const sessionRes = await fetch('/api/auth/session', {
          signal: controller.signal,
        });
        const sessionData = await sessionRes.json();

        const sessionRole = (sessionData?.user?.role || null) as UserRole | null;
        setRole(sessionRole);

        if (sessionRole !== UserRole.TALENT) {
          return;
        }

        const profileRes = await fetch('/api/profile', { signal: controller.signal });
        if (!profileRes.ok) {
          return;
        }
        const profile = await profileRes.json();
        const creatorId = profile?.creator?.id as string | undefined;

        if (!creatorId) {
          setMyUploads([]);
          return;
        }

        const mediaRes = await fetch(`/api/media?talentId=${creatorId}`, {
          signal: controller.signal,
        });
        if (!mediaRes.ok) {
          setMyUploads([]);
          return;
        }

        const media = await mediaRes.json();
        const mapped: TalentVM[] = (media || []).map((item: any) => ({
          id: item.talentId,
          name: item.title,
          bio: item.description || 'No description provided',
          sector: item.type,
          portfolioCount: 1,
          imageUrl:
            item.fileUrl ||
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        }));

        setMyUploads(mapped);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          console.error('Failed to load creator-specific talents:', err);
        }
      }
    };

    loadRoleAndCreatorContent();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (isCreatorView) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchTalents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ page: '1', limit: '50' });
        if (searchQuery) params.set('search', searchQuery);
        if (selectedSector) params.set('category', selectedSector);

        const response = await fetch(`/api/talents?${params}`, {
          signal: controller.signal,
        });
        const result = await response.json();

        const mapped: TalentVM[] = (result.data || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          bio: t.bio || '',
          sector: t.categoryLabel || t.category,
          portfolioCount: 0,
          imageUrl:
            t.avatar ||
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        }));

        setTalents(mapped);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          console.error('Failed to load talents:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
    return () => controller.abort();
  }, [searchQuery, selectedSector, isCreatorView]);

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
                <span className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  Filter by Sector
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedSector(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm border ${
                    selectedSector === null
                      ? "bg-blue-500 text-white border-blue-400"
                      : "bg-slate-800/50 text-slate-300 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800"
                  }`}
                >
                  All Sectors
                </button>

                {SECTORS.map((sector) => (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm border ${
                      selectedSector === sector.id
                        ? "bg-blue-500 text-white border-blue-400"
                        : "bg-slate-800/50 text-slate-300 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800"
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

      {/* Talents Grid */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isCreatorView ? (
            myUploads.length > 0 ? (
              <>
                <p className="text-sm text-slate-500 mb-8 font-medium uppercase tracking-wide">
                  Showing {myUploads.length} upload{myUploads.length === 1 ? '' : 's'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
                  {myUploads.map((talent) => (
                    <ModernTalentCard
                      key={talent.id}
                      id={talent.id}
                      name={talent.name}
                      category={talent.sector}
                      image={talent.imageUrl}
                      rating={4.5}
                      views={1200}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-24">
                <Search className="w-16 h-16 text-slate-600 mx-auto mb-6" />

                <h3 className="text-3xl font-bold text-white mb-3">
                  No talents found
                </h3>

                <p className="text-slate-400 mb-8 text-lg">
                  You have not uploaded any talents yet.
                </p>

                <Link
                  href="/talents/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <Plus className="w-5 h-5" />
                  Add New Talent
                </Link>
              </div>
            )
          ) : !loading && talents.length > 0 ? (
            <>
              <p className="text-sm text-slate-500 mb-8 font-medium uppercase tracking-wide">
                Showing {talents.length} talent{talents.length === 1 ? '' : 's'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
                {talents.map((talent) => (
                  <ModernTalentCard
                    key={talent.id}
                    id={talent.id}
                    name={talent.name}
                    category={talent.sector}
                    image={talent.imageUrl}
                    rating={4.5}
                    views={1200}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <Search className="w-16 h-16 text-slate-600 mx-auto mb-6" />

              <h3 className="text-3xl font-bold text-white mb-3">
                No talents found
              </h3>

              <p className="text-slate-400 mb-8 text-lg">
                Try adjusting your search or filter criteria
              </p>

              <button
                onClick={() => {
                  setSearchQuery("");
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
