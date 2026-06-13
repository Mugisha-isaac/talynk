'use client';

import Link from 'next/link';
import { getUnsplashUrl } from '@/lib/unsplash';
import { Heart, Share2 } from 'lucide-react';
import { useState } from 'react';

interface ProfileCardProps {
  name: string;
  title: string;
  imageId: string;
  category: string;
  stats?: {
    followers?: number;
    engagement?: number;
    views?: number;
  };
  badges?: string[];
  role: 'talent' | 'sponsor';
  href: string;
}

export function ProfileCard({
  name,
  title,
  imageId,
  category,
  stats,
  badges,
  role,
  href,
}: ProfileCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const imageUrl = getUnsplashUrl(imageId, {
    width: 400,
    height: 500,
    crop: 'faces',
  });

  return (
    <Link href={href}>
      <div className="group cursor-pointer relative h-96 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all duration-300">
        {/* Profile Image */}
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Action Buttons (Top Right) */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="w-10 h-10 bg-slate-950/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-slate-700/50 transition-all"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isLiked ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="w-10 h-10 bg-slate-950/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-slate-700/50 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Category Badge (Top Left) */}
        {badges && (
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                className="bg-blue-500/20 border border-blue-500/40 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 backdrop-blur-sm"
              >
                {badge}
              </div>
            ))}
          </div>
        )}

        {/* Profile Info (Bottom) */}
        <div className="absolute bottom-0 inset-x-0 p-4 space-y-3">
          {/* Name & Title */}
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-slate-300">{title}</p>
          </div>

          {/* Category */}
          <p className="text-xs text-slate-400 uppercase tracking-wide">{category}</p>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-700/30">
              {stats.followers !== undefined && (
                <div>
                  <p className="text-lg font-bold text-white">
                    {(stats.followers / 1000).toFixed(1)}K
                  </p>
                  <p className="text-xs text-slate-400">Followers</p>
                </div>
              )}
              {stats.engagement !== undefined && (
                <div>
                  <p className="text-lg font-bold text-slate-300">
                    {stats.engagement}%
                  </p>
                  <p className="text-xs text-slate-400">Engagement</p>
                </div>
              )}
              {stats.views !== undefined && (
                <div>
                  <p className="text-lg font-bold text-slate-300">
                    {(stats.views / 1000).toFixed(1)}K
                  </p>
                  <p className="text-xs text-slate-400">Views</p>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={(e) => e.preventDefault()}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            {role === 'talent' ? 'View Profile' : 'Learn More'}
          </button>
        </div>

        {/* Hover Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
      </div>
    </Link>
  );
}

export default ProfileCard;
