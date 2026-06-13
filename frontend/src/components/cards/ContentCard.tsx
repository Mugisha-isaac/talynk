'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { Avatar, Badge } from '../common';
import { Card } from '../common/Card';

interface ContentCardProps {
  content: any; // Content with creator info
  onLike?: (liked: boolean) => void;
  onComment?: () => void;
  onShare?: () => void;
  onClick?: () => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onLike,
  onComment,
  onShare,
  onClick,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(!isLiked);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
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
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-t-2xl bg-slate-700 aspect-video">
        <Image
          src={content.thumbnailUrl || '/placeholder-media.jpg'}
          alt={content.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Duration Badge */}
        {content.durationSeconds && (
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
            {Math.floor(content.durationSeconds / 60)}:{String(content.durationSeconds % 60).padStart(2, '0')}
          </div>
        )}

        {/* Mood Badge */}
        {content.aiDetectedMood && (
          <div className="absolute top-2 left-2">
            <Badge variant="primary" size="sm">
              {content.aiDetectedMood}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="p-4">
        {/* Creator Info */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar
            src={content.creator?.user?.avatarUrl}
            name={content.creator?.user?.displayName}
            size="sm"
            verified={content.creator?.isVerified}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {content.creator?.user?.displayName}
            </p>
            <p className="text-xs text-slate-400">
              in {content.categories[0]}
            </p>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm text-white mb-2 line-clamp-2">
          {content.title}
        </h3>

        {/* Tags */}
        <div className="flex gap-1 flex-wrap mb-3">
          {content.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="text-xs text-blue-400">
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-slate-400 py-2 border-t border-slate-700 mb-3">
          <span>👁 {(content.viewsCount / 1000).toFixed(1)}K</span>
          <span>❤ {(content.likesCount / 1000).toFixed(1)}K</span>
          <span>💬 {content.commentsCount}</span>
          <span>⚡ {content.engagementScore.toFixed(1)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-700/50 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-lg text-sm transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}
            />
            {isLiked ? 'Liked' : 'Like'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComment?.();
            }}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-700/50 hover:bg-blue-500/20 text-slate-300 hover:text-blue-400 rounded-lg text-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Reply
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <Bookmark
              className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`}
            />
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

ContentCard.displayName = 'ContentCard';
