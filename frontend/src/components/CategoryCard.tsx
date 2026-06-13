'use client';

import Link from 'next/link';
import { getUnsplashUrl } from '@/lib/unsplash';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  photoId: string;
  href: string;
  icon?: LucideIcon;
  count?: number;
}

export function CategoryCard({
  title,
  description,
  photoId,
  href,
  icon: Icon,
  count,
}: CategoryCardProps) {
  const imageUrl = getUnsplashUrl(photoId, {
    width: 600,
    height: 400,
    crop: 'entropy',
  });

  return (
    <Link href={href}>
      <div className="relative h-64 rounded-xl overflow-hidden group cursor-pointer bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all duration-300">
        {/* Background Image */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
          {/* Icon (if provided) */}
          {Icon && (
            <div className="self-start">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          )}

          {/* Bottom Content */}
          <div>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-slate-300 mb-3 line-clamp-2">{description}</p>

            {/* Count Badge */}
            {count && (
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
                <span className="text-xs font-semibold text-blue-300">{count} talents</span>
              </div>
            )}
          </div>
        </div>

        {/* Hover Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
      </div>
    </Link>
  );
}

export default CategoryCard;
