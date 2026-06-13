'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Heart, MessageCircle } from 'lucide-react';
import { getRandomSectorImage } from '@/lib/unsplash';

interface TalentCardProps {
  id: string;
  name: string;
  bio: string;
  sector: string;
  imageUrl?: string;
  portfolioCount?: number;
  matchScore?: number;
  onConnect?: () => void;
  showAction?: boolean;
}

export function TalentCard({
  id,
  name,
  bio,
  sector,
  imageUrl,
  portfolioCount = 0,
  matchScore,
  onConnect,
  showAction = true,
}: TalentCardProps) {
  const displayImage = imageUrl || getRandomSectorImage(sector);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 w-full overflow-hidden bg-gray-200">
        <Image
          src={displayImage}
          alt={name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {matchScore && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
            {Math.round(matchScore * 100)}% Match
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg text-foreground">{name}</h3>
            <Badge variant="outline" className="mt-2">
              {sector}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{bio}</p>
        {portfolioCount > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            📁 {portfolioCount} portfolio item{portfolioCount !== 1 ? 's' : ''}
          </p>
        )}
      </CardContent>

      {showAction && (
        <CardFooter className="gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => window.location.href = `/talents/${id}`}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onConnect}
            className="gap-2"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
