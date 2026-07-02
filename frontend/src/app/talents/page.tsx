"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ModernTalentCard } from "@/components/ModernTalentCard";
import { PortfolioCard, PortfolioItemVM } from "@/components/PortfolioCard";
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
  imageUrl?: string;
  visibilityScore?: number;
  recommended?: boolean;
  saved?: boolean;
}

export default function TalentsPage() {
  const [talents, setTalents] = useState<TalentVM[]>([]);
  const [myUploads, setMyUploads] = useState<PortfolioItemVM[]>([]);
  const [topTalents, setTopTalents] = useState<TalentVM[]>([]);
  const [topLoading, setTopLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  const [savePending, setSavePending] = useState<Set<string>>(new Set());

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
        const items = media || [];

        // Pull real like/comment/share counts for each upload in parallel.
        const counts = await Promise.all(
          items.map((item: any) =>
            fetch(`/api/content/${item.id}/interactions`, { signal: controller.signal })
              .then((r) => (r.ok ? r.json() : null))
              .catch(() => null)
          )
        );

        const mapped: PortfolioItemVM[] = items.map((item: any, i: number) => ({
          id: item.id,
          title: item.title,
          type: item.type === 'IMAGE' ? 'images' : item.type === 'VIDEO' ? 'video' : 'audio',
          count: 1,
          cover: item.fileUrl,
          likeCount: counts[i]?.likeCount ?? 0,
          shareCount: counts[i]?.shareCount ?? 0,
          commentCount: counts[i]?.commentCount ?? 0,
          likedByMe: counts[i]?.likedByMe ?? false,
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

  // Top 5 recommended talents overall, ranked by ML-evaluated visibility
  // score. Shown to sponsors/guests before they pick a sector.
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
        const mapped: TalentVM[] = (result.data || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          bio: t.bio || '',
          sector: t.categoryLabel || t.category,
          portfolioCount: 0,
          imageUrl: t.avatar || undefined,
          visibilityScore: t.visibilityScore,
          recommended: !!t.recommended,
          saved: !!t.saved,
        }));
        setTopTalents(mapped);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          console.error('Failed to load top talents:', err);
        }
      } finally {
        setTopLoading(false);
      }
    };

    loadTopTalents();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (isCreatorView) {
      setLoading(false);
      return;
    }

    // Sponsors/guests see the Top 5 spotlight until they pick a sector.
    if (!selectedSector) {
      setTalents([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchTalents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          category: selectedSector,
          page: '1',
          limit: '50',
        });
        if (searchQuery.trim()) params.set('search', searchQuery.trim());

        const response = await fetch(`/api/talents?${params}`, {
          signal: controller.signal,
        });
        const result = await response.json();

        // Saved talents surface first within the sector too (API already
        // sorts this way, but the map below preserves that order).
        const mapped: TalentVM[] = (result.data || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          bio: t.bio || '',
          sector: t.categoryLabel || t.category,
          portfolioCount: 0,
          imageUrl: t.avatar || undefined,
          recommended: !!t.recommended,
          saved: !!t.saved,
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

  const toggleSave = async (talentId: string) => {
    if (savePending.has(talentId)) return;
    setSavePending((prev) => new Set(prev).add(talentId));

    const applyLocal = (saved: boolean) => {
      setTalents((prev) => prev.map((t) => (t.id === talentId ? { ...t, saved } : t)));
      setTopTalents((prev) => prev.map((t) => (t.id === talentId ? { ...t, saved } : t)));
    };

    try {
      const res = await fetch(`/api/talents/${talentId}/save`, { method: 'POST' });
      if (!res.ok) throw new Error();
      const result = await res.json();
      applyLocal(!!result.saved);
    } catch {
      // Leave optimistic UI as-is on failure; ModernTalentCard already
      // flips its own local state, this just keeps parent lists in sync
      // when the request succeeds.
    } finally {
      setSavePending((prev) => {
        const next = new Set(prev);
        next.delete(talentId);
        return next;
      });
    }
  };

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
            Browse Talented <span className="text-blue-400">Creators</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl">
            {isCreatorView
              ? 'Manage your portfolio and see how it appears to sponsors'
              : 'Select a sector to discover the strongest creator matches'}
          </p>
        </div>
      </section>

      {/* Top 5 Recommended Talents (sponsors/guests, before a sector is picked) */}
      {!isCreatorView && !selectedSector && (
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
                      category={talent.sector}
                      image={talent.imageUrl}
                      rating={4.5}
                      views={1200}
                      recommended={talent.recommended}
                      isLiked={talent.saved}
                      onLike={() => toggleSave(talent.id)}
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
      )}

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
                  {isCreatorView ? 'Filter by Sector' : 'Choose a Sector'}
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
                  {isCreatorView ? 'All Sectors' : 'Top Picks'}
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
                <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">
                    Showing {myUploads.length} upload{myUploads.length === 1 ? '' : 's'}
                  </p>
                  <Link
                    href="/talents/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
                  {myUploads.map((item) => (
                    <PortfolioCard key={item.id} item={item} />
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
          ) : !selectedSector ? (
            <div className="text-center py-24">
              <Sliders className="w-16 h-16 text-slate-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-3">
                Select a sector to view talents
              </h3>
              <p className="text-slate-400 text-lg">
                Pick any sector above to load matching creator portfolios
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
                    category={talent.sector}
                    image={talent.imageUrl}
                    rating={4.5}
                    views={1200}
                    recommended={talent.recommended}
                    isLiked={talent.saved}
                    onLike={() => toggleSave(talent.id)}
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