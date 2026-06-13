'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Share2,
  Music,
  Image as ImageIcon,
  VideoIcon,
} from 'lucide-react';
import { VerificationBadge, StatusBadge, Statistic } from '@/components/foundation/index';

interface CreatorCardProps {
  id: string;
  name: string;
  avatar: string;
  category: string;
  followers: number;
  engagement: number;
  aiScore: number;
  isVerified?: boolean;
  isTrending?: boolean;
  bio?: string;
  featured?: boolean;
  imageUrl?: string;
}

/**
 * Creator Card Component
 * Premium card showcasing creator profile with engagement metrics
 * Variations: Featured (large), Standard, Compact
 */
export function CreatorCard({
  id,
  name,
  avatar,
  category,
  followers,
  engagement,
  aiScore,
  isVerified = false,
  isTrending = false,
  bio,
  featured = false,
  imageUrl,
}: CreatorCardProps) {

  if (featured) {
    return (
      <Link href={`/creators/${id}`}>
        <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
          {/* Background Image */}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          {/* Trending Badge */}
          {isTrending && (
            <div className="absolute top-4 right-4 z-10">
              <StatusBadge status="trending" size="sm" />
            </div>
          )}

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20">
                  <Image src={avatar} alt={name} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-lg">{name}</h3>
                    {isVerified && <VerificationBadge />}
                  </div>
                  <p className="text-text-secondary text-sm">{category}</p>
                </div>
              </div>
            </div>

            {bio && <p className="text-text-secondary text-sm mb-4 line-clamp-2">{bio}</p>}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Statistic
                label="Followers"
                value={(followers / 1000).toFixed(1)}
                unit="K"
              />
              <Statistic label="Engagement" value={engagement.toFixed(1)} unit="%" />
              <Statistic label="AI Score" value={aiScore} unit="/100" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/creators/${id}`}>
      <div className="group relative bg-gradient-to-br from-bg-dark to-bg-darker rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border border-border-medium hover:border-primary-blue/50">
        {/* Header with Image */}
        {imageUrl ? (
          <div className="relative h-32 overflow-hidden bg-border-medium">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
          </div>
        ) : (
          <div className="h-24 bg-gradient-to-br from-primary-blue/20 to-primary-purple/20" />
        )}

        {/* Content */}
        <div className="p-4 relative">
          {/* Avatar (positioned to overlap image) */}
          <div className="flex items-start justify-between mb-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-3 border-bg-dark -mt-8 mb-2">
              <Image src={avatar} alt={name} fill className="object-cover" />
            </div>
            {isTrending && (
              <StatusBadge status="trending" size="sm" />
            )}
          </div>

          {/* Name and Verification */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-text-primary line-clamp-1">{name}</h3>
            {isVerified && <VerificationBadge />}
          </div>

          {/* Category */}
          <p className="text-text-tertiary text-xs mb-3">{category}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <p className="text-sm font-bold text-text-primary">
                {(followers / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-text-tertiary">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-text-primary">{engagement.toFixed(1)}%</p>
              <p className="text-xs text-text-tertiary">Engagement</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-accent-teal">{aiScore}/100</p>
              <p className="text-xs text-text-tertiary">AI Score</p>
            </div>
          </div>

          {/* Action */}
          <button className="w-full py-2 rounded-lg bg-primary-blue/10 hover:bg-primary-blue/20 text-primary-blue text-sm font-medium transition-colors">
            View Profile
          </button>
        </div>
      </div>
    </Link>
  );
}

interface ContentCardProps {
  id: string;
  title: string;
  thumbnail: string;
  creator: {
    name: string;
    avatar: string;
  };
  type: 'video' | 'image' | 'audio';
  duration?: string;
  views: number;
  likes: number;
  comments: number;
  compact?: boolean;
}

/**
 * Content Card Component
 * Displays media content with engagement metrics
 */
export function ContentCard({
  id,
  title,
  thumbnail,
  creator,
  type,
  duration,
  views,
  likes,
  comments,
  compact = false,
}: ContentCardProps) {
  const typeIcons = {
    video: VideoIcon,
    image: ImageIcon,
    audio: Music,
  };

  const TypeIcon = typeIcons[type];

  if (compact) {
    return (
      <Link href={`/content/${id}`}>
        <div className="group relative h-40 rounded-lg overflow-hidden cursor-pointer">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Duration Badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-medium text-white">
              {duration}
            </div>
          )}

          {/* Type Icon */}
          <div className="absolute top-2 right-2 p-1 bg-white/20 rounded backdrop-blur-sm">
            <TypeIcon className="w-4 h-4 text-white" />
          </div>

          {/* Hover Stats */}
          <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-full space-y-1">
              <p className="text-white text-sm font-semibold line-clamp-1">{title}</p>
              <div className="flex items-center gap-4 text-xs text-white/80">
                <span>{(views / 1000).toFixed(0)}K views</span>
                <span>{likes} likes</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/content/${id}`}>
      <div className="group bg-bg-dark rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-border-medium hover:border-primary-blue/50">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Type Badge */}
          <div className="absolute top-3 right-3 p-2 bg-black/60 rounded-lg backdrop-blur-sm">
            <TypeIcon className="w-4 h-4 text-white" />
          </div>

          {/* Duration */}
          {duration && (
            <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-medium text-white">
              {duration}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Creator Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image src={creator.avatar} alt={creator.name} fill className="object-cover" />
            </div>
            <span className="text-text-secondary text-sm">{creator.name}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-text-primary mb-3 line-clamp-2">{title}</h3>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span>{(views / 1000).toFixed(0)}K views</span>
            <div className="flex gap-3">
              <span>{likes} likes</span>
              <span>{comments} comments</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ActivityCardProps {
  type: 'like' | 'follow' | 'comment' | 'share';
  actor: {
    name: string;
    avatar: string;
  };
  subject: string;
  timestamp: string;
  actionUrl?: string;
}

/**
 * Activity Card Component
 * Shows social activity in feed
 */
export function ActivityCard({
  type,
  actor,
  subject,
  timestamp,
  actionUrl,
}: ActivityCardProps) {
  const activityConfig = {
    like: { icon: Heart, color: 'text-red-400', label: 'liked' },
    follow: { icon: Heart, color: 'text-primary-blue', label: 'followed' },
    comment: { icon: MessageCircle, color: 'text-accent-teal', label: 'commented on' },
    share: { icon: Share2, color: 'text-accent-orange', label: 'shared' },
  };

  const config = activityConfig[type];
  const Icon = config.icon;

  return (
    <Link href={actionUrl || '#'}>
      <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-dark/50 border border-border-medium hover:border-primary-blue/50 hover:bg-bg-dark transition-all duration-200 cursor-pointer">
        {/* Actor Avatar */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image src={actor.avatar} alt={actor.name} fill className="object-cover" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-text-primary text-sm">{actor.name}</span>
            <span className="text-text-secondary text-sm">{config.label}</span>
          </div>
          <p className="text-text-tertiary text-sm line-clamp-1">{subject}</p>
          <p className="text-text-muted text-xs mt-1">{timestamp}</p>
        </div>

        {/* Icon */}
        <Icon className={`w-5 h-5 ${config.color} flex-shrink-0`} />
      </div>
    </Link>
  );
}

export const cardComponents = {
  CreatorCard,
  ContentCard,
  ActivityCard,
};
