'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, MessageCircle } from 'lucide-react';

export default function TalentProfilePage({ params }: { params: { id: string } }) {
  // This would normally fetch from API
  const talent = {
    id: params.id,
    name: 'Sarah Anderson',
    sector: 'Photography',
    bio: 'Professional photographer specializing in portrait and landscape photography with 10+ years experience',
    portfolio: [
      { title: 'Portrait Series', type: 'images' },
      { title: 'Landscape Collection', type: 'images' },
      { title: 'Documentary', type: 'video' },
    ],
  };

  return (
    <>
      <Navigation />

      {/* Cover & Profile */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <span className="text-6xl">📸</span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">{talent.name}</h1>
              <Badge className="mb-4">{talent.sector}</Badge>
              <p className="text-lg text-muted-foreground mb-6">{talent.bio}</p>

              <div className="flex gap-3">
                <Button className="gap-2">
                  <Heart className="w-4 h-4" />
                  Save
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Contact
                </Button>
                <Button variant="outline" size="icon">
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
          <h2 className="text-3xl font-bold text-foreground mb-8">Portfolio</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {talent.portfolio.map((item, idx) => (
              <div
                key={idx}
                className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {item.type === 'images' ? '🖼️' : '🎬'}
                  </div>
                  <p className="text-sm font-medium">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
