'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Mail, Phone, MapPin, BadgeCheck, Star, Users, Layers } from 'lucide-react';

export default function SponsorProfilePage({ params }: { params: { id: string } }) {
  // This would normally fetch from API
  const sponsor = {
    id: params.id,
    name: 'Creative Director',
    company: 'Adobe Creative Studios',
    verified: true,
    bio: 'We are a leading creative agency focused on cutting-edge digital experiences and innovative brand solutions.',
    sectors: ['Design', 'Photography', 'Film & Video'],
    website: 'https://adobe.com',
    email: 'hello@adobe.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    talentConnected: 12,
    rating: 4.8,
  };

  const contactItems: {
    icon: typeof Globe;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
  }[] = [
    {
      icon: Globe,
      label: 'Website',
      value: sponsor.website.replace('https://', ''),
      href: sponsor.website,
      external: true,
    },
    { icon: Mail, label: 'Email', value: sponsor.email, href: `mailto:${sponsor.email}` },
    { icon: Phone, label: 'Phone', value: sponsor.phone },
    { icon: MapPin, label: 'Location', value: sponsor.location },
  ];

  const stats: { icon: typeof Users; label: string; value: number | string; suffix?: string }[] = [
    { icon: Users, label: 'Talents connected', value: sponsor.talentConnected },
    { icon: Layers, label: 'Active sectors', value: sponsor.sectors.length },
    { icon: Star, label: 'Rating', value: sponsor.rating, suffix: '/5' },
  ];

  return (
    <>
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-br from-primary/15 via-secondary/10 to-background pt-12 pb-10 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${sponsor.company}`}
                  alt={sponsor.company}
                  className="w-full h-full object-cover"
                />
              </div>
              {sponsor.verified && (
                <span className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-md">
                  <BadgeCheck className="w-6 h-6 text-primary" />
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">{sponsor.company}</h1>
              <p className="text-base text-muted-foreground mb-4">{sponsor.name}</p>
              <p className="text-base md:text-lg text-muted-foreground mb-4 max-w-2xl">{sponsor.bio}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {sponsor.sectors.map((sector) => (
                  <Badge key={sector} variant="secondary">
                    {sector}
                  </Badge>
                ))}
              </div>

              <Button onClick={() => (window.location.href = '/auth/signup?role=talent')}>
                Browse their opportunities
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="flex items-center gap-4 p-6 rounded-xl border border-border bg-muted/30"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {s.value}
                      {s.suffix ?? ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Contact information</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {contactItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="text-lg font-semibold text-primary hover:underline break-all"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-lg font-semibold text-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-muted/40 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground">Looking to collaborate with {sponsor.company}?</p>
            <p className="text-sm text-muted-foreground">Sign up as talent to apply to their opportunities.</p>
          </div>
          <Button size="lg" onClick={() => (window.location.href = '/auth/signup?role=talent')}>
            Browse their opportunities
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
}