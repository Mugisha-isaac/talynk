'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Play, Share2, MoreVertical } from 'lucide-react';
import { Avatar, Badge } from '../common';
import { Card } from '../common/Card';

interface CreatorCardProps {
  creator: any; // Creator data with user info
  onLike?: (liked: boolean) => void;
  onShare?: () => void;
  onClick?: () => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  onLike,
  onShare,
  onClick,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.();
  };

  return (
    <Card
      variant="premium"
      onClick={onClick}
      className="overflow-hidden group"
    >
      {/* Cover Image */}
      <div className="relative overflow-hidden rounded-t-2xl bg-slate-700 aspect-square">
        <Image
          src={creator.user?.avatarUrl || '/placeholder-avatar.jpg'}
          alt={creator.user?.displayName || 'Creator'}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 text-black fill-black" />
          </button>
        </div>

        {/* AI Recommendation Badge */}
        {creator.aiVisibilityScore > 7.5 && (
          <div className="absolute top-3 left-3">
            <Badge variant="gold" size="sm">
              ✨ AI Recommended
            </Badge>
          </div>
        )}

        {/* Verification Badge */}
        {creator.isVerified && (
          <div className="absolute top-3 right-3">
            <Badge variant="info" size="sm">
              ✓ Verified
            </Badge>
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute bottom-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-slate-900'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Creator Info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            src={creator.user?.avatarUrl}
            name={creator.user?.displayName}
            size="sm"
            verified={creator.isVerified}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-white truncate">
              {creator.user?.displayName}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              @{creator.user?.username}
            </p>
          </div>
        </div>

        {/* Category */}
        <div className="mb-3 flex gap-1 flex-wrap">
          {creator.categories.slice(0, 2).map((cat: string) => (
            <Badge key={cat} variant="primary" size="sm">
              {cat}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 py-2 border-t border-slate-700">
          <span>👁 {(creator.viewsCount / 1000).toFixed(1)}K views</span>
          <span>❤ {(creator.likesCount / 1000).toFixed(1)}K likes</span>
          <span>👥 {(creator.followersCount / 1000).toFixed(1)}K</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm font-medium transition-colors">
            Follow
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

CreatorCard.displayName = 'CreatorCard';
