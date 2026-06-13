'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MoreVertical, Building } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface ModernSponsorCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  budget?: string;
  isLiked?: boolean;
  onLike?: () => void;
}

export function ModernSponsorCard({
  id,
  name,
  category,
  image,
  budget = '$10K - $50K',
  isLiked = false,
  onLike,
}: ModernSponsorCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    onLike?.();
  };

  return (
    <Link href={`/sponsors/${id}`}>
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
                <Building className="w-12 h-12 opacity-40" />
                <span className="text-xs text-slate-600">No image</span>
              </div>
            )}

            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="px-3 py-1.5 text-xs font-semibold bg-blue-500/90 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-lg">
                {category}
              </span>
            </div>

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

            {/* Like Button */}
            <button
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={(e) => {
                e.preventDefault();
                handleLike();
              }}
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

            {/* Budget */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/30">
              <span className="text-xs text-slate-400">Budget Range</span>
              <span className="text-sm font-semibold text-amber-400/90 group-hover:text-amber-300 transition-colors duration-200">
                {budget}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
