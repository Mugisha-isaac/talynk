'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

export default function SponsorProfilePage({ params }: { params: { id: string } }) {
  // This would normally fetch from API
  const sponsor = {
    id: params.id,
    name: 'Creative Director',
    company: 'Adobe Creative Studios',
    bio: 'We are a leading creative agency focused on cutting-edge digital experiences and innovative brand solutions.',
    sectors: ['Design', 'Photography', 'Film & Video'],
    website: 'https://adobe.com',
    email: 'hello@adobe.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    talentConnected: 12,
  };

  return (
    <>
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <span className="text-6xl">🏢</span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2">{sponsor.company}</h1>
              <p className="text-lg text-muted-foreground mb-1">{sponsor.name}</p>
              <p className="text-base text-muted-foreground mb-4">{sponsor.bio}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {sponsor.sectors.map((sector) => (
                  <Badge key={sector} variant="secondary">
                    {sector}
                  </Badge>
                ))}
              </div>

              <Button onClick={() => window.location.href = '/auth/signup?role=talent'}>
                Browse Their Opportunities
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Website</p>
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-primary hover:underline"
                >
                  {sponsor.website.replace('https://', '')}
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <a href={`mailto:${sponsor.email}`} className="text-lg font-semibold text-primary hover:underline">
                  {sponsor.email}
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p className="text-lg font-semibold">{sponsor.phone}</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="text-lg font-semibold">{sponsor.location}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Company Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <p className="text-sm text-muted-foreground mb-2">Talents Connected</p>
              <p className="text-4xl font-bold text-primary">{sponsor.talentConnected}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <p className="text-sm text-muted-foreground mb-2">Active Sectors</p>
              <p className="text-4xl font-bold text-primary">{sponsor.sectors.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <p className="text-sm text-muted-foreground mb-2">Rating</p>
              <p className="text-4xl font-bold text-primary">4.8⭐</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
