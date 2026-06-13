// src/components/AIRecommendationCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface AIRecommendationCardProps {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  matchScore: number;
  reason: string;
  factors: {
    label: string;
    value: number;
  }[];
  onAccept?: () => void;
  onReject?: () => void;
  isPriority?: boolean;
}

export function AIRecommendationCard({
  title,
  subtitle,
  image,
  matchScore,
  reason,
  factors,
  onAccept,
  onReject,
  isPriority = false,
}: AIRecommendationCardProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-card/80 via-card/60 to-violet-600/10 border border-white/10 backdrop-blur-md hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg p-6">
      {/* AI Glow */}
      {isPriority && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                AI Recommended
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>

          {/* Match Score */}
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    {Math.round(matchScore)}
                  </div>
                  <div className="text-xs text-muted-foreground">match</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <p className="text-sm text-white">
            <span className="font-semibold text-cyan-400">Why?</span> {reason}
          </p>
        </div>

        {/* Factors */}
        <div className="mb-6 space-y-2">
          {factors.map((factor, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{factor.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-all"
                    style={{ width: `${factor.value}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-white w-8 text-right">
                  {factor.value}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Image Preview */}
        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 border border-white/10">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onAccept}
            className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-500 hover:shadow-lg"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Creator
          </Button>
          <Button
            onClick={onReject}
            variant="secondary"
            className="flex-1"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  );
}
