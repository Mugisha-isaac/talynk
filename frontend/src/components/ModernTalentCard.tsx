'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Play, MoreVertical, User, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

interface ModernTalentCardProps {
  id: string;
  name: string;
  category: string;
  image?: string;
  rating?: number;
  views?: number;
  isLiked?: boolean;
  recommended?: boolean;
  onLike?: () => void;
}

export function ModernTalentCard({
  id,
  name,
  category,
  image,
  rating = 4.5,
  views = 1200,
  isLiked = false,
  recommended = false,
  onLike,
}: ModernTalentCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Keep in sync if the parent refetches and the real saved state changes
  // (e.g. after the toggle round-trips to the backend).
  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setLiked(!liked);
    onLike?.();
  };

  return (
    <Link href={`/talents/${id}`}>
      <div className="group cursor-pointer h-full">
        {/* Card Container - Refined */}
        <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-slate-600/75 backdrop-blur-sm h-full flex flex-col">
          {/* Image Container */}
          <div className="relative w-full aspect-video bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0">
            {!imageError && image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                <User className="w-12 h-12 opacity-40" />
                <span className="text-xs text-slate-600">No image</span>
              </div>
            )}

            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Top-left status badges - always visible, not just on hover */}
            {(recommended || liked) && (
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {recommended && (
                  <span className="inline-flex items-center gap-1 bg-blue-500/90 text-white text-[11px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm shadow">
                    <Sparkles className="w-3 h-3" />
                    Recommended
                  </span>
                )}
                {liked && (
                  <span className="inline-flex items-center gap-1 bg-red-500/90 text-white text-[11px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm shadow">
                    <Heart className="w-3 h-3 fill-current" />
                    Favorite
                  </span>
                )}
              </div>
            )}

            {/* Play Button */}
            <button
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-200 hover:scale-110 shadow-lg">
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              </div>
            </button>

            {/* Top Actions */}
            <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="ghost"
                className="bg-black/60 hover:bg-black/80 text-white w-9 h-9 rounded-full backdrop-blur-sm transition-smooth"
                onClick={(e) => {
                  e.preventDefault();
                  setShowMenu(!showMenu);
                }}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            {/* Save/Favorite Button */}
            <button
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handleLike}
              aria-label={liked ? 'Remove from favorites' : 'Save to favorites'}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm shadow-lg ${
                  liked ? 'bg-red-500 hover:bg-red-600' : 'bg-black/60 hover:bg-black/80'
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${liked ? 'fill-white text-white' : 'text-white'}`}
                />
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
              <h3 className="font-semibold text-base text-slate-50 truncate group-hover:text-blue-400 transition-colors duration-200">
                {name}
              </h3>
              <p className="text-sm text-slate-400 truncate mt-1.5">{category}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/30 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                ⭐ <span className="font-medium text-slate-300">{rating.toFixed(1)}</span>
              </span>
              <span className="text-slate-500">{views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}