// src/components/MediaCard.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Bookmark, Play } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

interface MediaCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO';
  category: string;
  creatorName: string;
  creatorAvatar: string;
  creatorId: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  aiCaption?: string;
  confidence?: number;
  variant?: 'compact' | 'featured';
}

export function MediaCard({
  id,
  title,
  thumbnailUrl,
  type,
  category,
  creatorName,
  creatorAvatar,
  creatorId,
  likes,
  comments,
  shares,
  isLiked = false,
  isSaved = false,
  onLike,
  onSave,
  onShare,
  aiCaption,
  confidence,
  variant = 'compact',
}: MediaCardProps) {
  const [hovered, setHovered] = useState(false);

  if (variant === 'featured') {
    return (
      <Link href={`/talents/${creatorId}/media/${id}`}>
        <div
          className="group relative rounded-3xl overflow-hidden bg-card/80 border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Featured Image */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Play Button for videos */}
            {type === 'VIDEO' && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="rounded-full bg-white/20 backdrop-blur-md border border-white/30 p-4 hover:bg-white/30 transition-colors">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
            )}

            {/* AI Confidence Badge */}
            {confidence && (
              <div className="absolute top-4 right-4 bg-cyan-500/20 backdrop-blur-md border border-cyan-400/50 rounded-full px-3 py-1">
                <span className="text-xs font-semibold text-cyan-300">
                  AI {Math.round(confidence)}%
                </span>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-violet-600/90">{category}</Badge>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                {title}
              </h3>

              {aiCaption && (
                <p className="text-sm text-white/80 line-clamp-1 mb-3">
                  {aiCaption}
                </p>
              )}

              {/* Creator Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src={creatorAvatar}
                    alt={creatorName}
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-white/30"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {creatorName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onLike?.();
                  }}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-red-500 transition-colors group/like"
                >
                  <Heart
                    className={`w-4 h-4 transition-all ${
                      isLiked
                        ? 'fill-red-500 text-red-500'
                        : 'group-hover/like:scale-110'
                    }`}
                  />
                  <span>{likes > 1000 ? `${(likes / 1000).toFixed(1)}K` : likes}</span>
                </button>

                <button className="flex items-center space-x-1 text-muted-foreground hover:text-blue-400 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>{comments > 1000 ? `${(comments / 1000).toFixed(1)}K` : comments}</span>
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onShare?.();
                  }}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-green-400 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{shares > 1000 ? `${(shares / 1000).toFixed(1)}K` : shares}</span>
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  onSave?.();
                }}
              >
                <Bookmark
                  className={`w-4 h-4 transition-all ${
                    isSaved
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-muted-foreground hover:text-amber-500'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Compact variant
  return (
    <Link href={`/talents/${creatorId}/media/${id}`}>
      <div
        className="group relative rounded-xl overflow-hidden bg-card/80 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Overlay on hover */}
          {hovered && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              {type === 'VIDEO' && (
                <Play className="w-10 h-10 text-white fill-white" />
              )}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {confidence && (
              <div className="bg-cyan-500/20 backdrop-blur-md border border-cyan-400/50 rounded-full px-2 py-1">
                <span className="text-xs font-semibold text-cyan-300">
                  AI {Math.round(confidence)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h4 className="font-semibold text-white text-sm line-clamp-2 mb-2">
            {title}
          </h4>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src={creatorAvatar}
                alt={creatorName}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-xs text-muted-foreground line-clamp-1">
                {creatorName}
              </span>
            </div>
            <Badge variant="info" className="text-xs">
              {category}
            </Badge>
          </div>

          {/* Engagement Preview */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-xs text-muted-foreground">
            <span>❤️ {likes > 1000 ? `${(likes / 1000).toFixed(1)}K` : likes}</span>
            <span>💬 {comments > 1000 ? `${(comments / 1000).toFixed(1)}K` : comments}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
