'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, MessageCircle, MapPin, BadgeCheck, Star, Play } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TalentProfilePage({ params }: { params: { id: string } }) {
  const [saved, setSaved] = useState(false);
  const [talent, setTalent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTalent = async () => {
      try {
        const response = await fetch(`/api/talents/${params.id}`);
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Talent not found');
        }
        setTalent({
          id: result.data.id,
          name: result.data.name,
          sector: result.data.category,
          location: result.data.location || 'Unknown',
          verified: false,
          rating: result.data.visibilityScore ? result.data.visibilityScore / 20 : 0,
          reviews: 0,
          bio: result.data.bio || '',
          stats: [
            { label: 'Followers', value: result.data.followers?.toLocaleString() ?? '0' },
            { label: 'Content', value: String(result.data.portfolio?.length ?? 0) },
            { label: 'Visibility score', value: String(Math.round(result.data.visibilityScore ?? 0)) },
          ],
          portfolio: (result.data.portfolio || []).map((item: any) => ({
            title: item.title,
            type: item.type === 'IMAGE' ? 'images' : item.type === 'VIDEO' ? 'video' : 'audio',
            count: 1,
            cover: item.cover,
          })),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load talent');
      } finally {
        setLoading(false);
      }
    };

    fetchTalent();
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="p-10 text-center text-muted-foreground">Loading...</div>
        <Footer />
      </>
    );
  }

  if (error || !talent) {
    return (
      <>
        <Navigation />
        <div className="p-10 text-center text-muted-foreground">{error || 'Talent not found'}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />

      {/* Cover & Profile */}
      <section className="relative bg-gradient-to-br from-primary/15 via-secondary/10 to-background pt-12 pb-10 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-6xl shadow-lg overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${talent.name}`}
                  alt={talent.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {talent.verified && (
                <span className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-md">
                  <BadgeCheck className="w-6 h-6 text-primary" />
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">{talent.name}</h1>
                <Badge>{talent.sector}</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {talent.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {talent.rating} <span className="text-muted-foreground/70">({talent.reviews} reviews)</span>
                </span>
              </div>

              <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl">{talent.bio}</p>

              {/* Stats */}
              <div className="flex gap-6 mb-6">
                {talent.stats.map((s: { label: string; value: string }) => (
                  <div key={s.label}>
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Contact
                </Button>
                <Button
                  variant={saved ? 'default' : 'outline'}
                  className="gap-2"
                  onClick={() => setSaved(!saved)}
                >
                  <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                  {saved ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" size="icon" aria-label="Share profile">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Portfolio</h2>
            <span className="text-sm text-muted-foreground">{talent.portfolio.length} collections</span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {talent.portfolio.map((item: { title: string; type: string; count: number; cover: string }, idx: number) => (
              <button
                key={idx}
                className="group relative aspect-square rounded-xl overflow-hidden bg-muted text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* Cover image with graceful fallback */}
                <img
                  src={item.cover}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {item.type === 'video' && (
                  <span className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </span>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/70">
                    {item.count} {item.type === 'video' ? 'videos' : 'photos'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-muted/40 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground">Interested in working with {talent.name.split(' ')[0]}?</p>
            <p className="text-sm text-muted-foreground">Usually responds within a day.</p>
          </div>
          <Button size="lg" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Start a conversation
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
}