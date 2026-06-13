'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ExternalLink, Star } from 'lucide-react';
import { getRandomSectorImage } from '@/lib/unsplash';

interface SponsorCardProps {
  id: string;
  name: string;
  company: string;
  bio: string;
  sectors: string[];
  logoUrl?: string;
  website?: string;
  talentCount?: number;
  rating?: number;
  showAction?: boolean;
}

export function SponsorCard({
  id,
  name,
  company,
  bio,
  sectors,
  logoUrl,
  website,
  talentCount = 0,
  rating = 4.5,
  showAction = true,
}: SponsorCardProps) {
  const displayImage = logoUrl || getRandomSectorImage('sponsor');

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <Image
          src={displayImage}
          alt={company}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-foreground">{company}</h3>
          <p className="text-sm text-muted-foreground">{name}</p>
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[...Array(Math.floor(rating))].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-1">{rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{bio}</p>
        <div className="flex flex-wrap gap-2">
          {sectors.slice(0, 3).map((sector) => (
            <Badge key={sector} variant="secondary" className="text-xs">
              {sector}
            </Badge>
          ))}
          {sectors.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{sectors.length - 3}
            </Badge>
          )}
        </div>
        {talentCount > 0 && (
          <p className="text-xs text-muted-foreground mt-3">
            💼 Connected with {talentCount} talent{talentCount !== 1 ? 's' : ''}
          </p>
        )}
      </CardContent>

      {showAction && (
        <CardFooter className="gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => window.location.href = `/sponsors/${id}`}
          >
            View Company
          </Button>
          {website && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.open(website, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
