// src/components/CreatorCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

interface CreatorCardProps {
  id: string;
  name: string;
  avatar: string;
  category: string;
  verified?: boolean;
  followers: number;
  engagementRate: number;
  visibilityScore?: number;
  isFollowing?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
}

export function CreatorCard({
  id,
  name,
  avatar,
  category,
  verified = false,
  followers,
  engagementRate,
  visibilityScore,
  isFollowing = false,
  onFollow,
  onMessage,
}: CreatorCardProps) {
  return (
    <Link href={`/talents/${id}`}>
      <div className="group relative rounded-2xl bg-card/80 backdrop-blur-md border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="relative p-6">
          {/* Avatar */}
          <div className="mb-4 flex items-start justify-between">
            <div className="relative">
              <Image
                src={avatar}
                alt={name}
                width={64}
                height={64}
                className="rounded-full border-2 border-violet-500/50 object-cover"
              />
              {verified && (
                <div className="absolute -bottom-1 -right-1 bg-violet-600 rounded-full p-1">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* AI Score Badge */}
            {visibilityScore !== undefined && (
              <div className="flex flex-col items-center">
                <div className="text-sm font-bold text-cyan-400">
                  {Math.round(visibilityScore)}
                </div>
                <div className="text-xs text-muted-foreground">AI Score</div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
              {name}
            </h3>
            <Badge variant="info" className="mb-3">
              {category}
            </Badge>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Followers</div>
                <div className="font-semibold text-white">
                  {followers > 1000
                    ? `${(followers / 1000).toFixed(1)}K`
                    : followers}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Engagement</div>
                <div className="font-semibold text-white">
                  {engagementRate.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                onFollow?.();
              }}
              variant={isFollowing ? 'secondary' : 'primary'}
              className="w-full"
              size="sm"
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>

            {onMessage && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onMessage?.();
                }}
                variant="ghost"
                className="w-full"
                size="sm"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
