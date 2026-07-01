"use client";

import React from "react";
import { FeedLayout } from "@/components/FeedLayout";
import { MediaCard } from "@/components/MediaCard";
import { CreatorCard } from "@/components/CreatorCard";
import { AIRecommendationCard } from "@/components/AIRecommendationCard";
import { Button } from "@/components/common/Button";
import { Sparkles, TrendingUp, Zap, Loader2 } from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";

const mockTrending = [
  {
    id: "1",
    title: "Contemporary Dance Showcase",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1550026593-cb89847b168d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "VIDEO" as const,
    category: "Dance",
    creatorName: "Amara Movements",
    creatorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    creatorId: "creator-1",
    likes: 45200,
    comments: 3400,
    shares: 2100,
  },
  {
    id: "2",
    title: "Afrobeats Production Tips",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    type: "VIDEO" as const,
    category: "Music",
    creatorName: "DJ Kigali",
    creatorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    creatorId: "creator-2",
    likes: 32100,
    comments: 2200,
    shares: 1800,
  },
];

const mockFeaturedCreators = [
  {
    id: "creator-1",
    name: "Amara Movements",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    category: "Choreography",
    verified: true,
    followers: 125400,
    engagementRate: 8.2,
    visibilityScore: 92,
  },
];

const PLACEHOLDER_IMAGES: Record<string, string> = {
  audio:
    "https://images.unsplash.com/photo-1527735095040-147bffb4cede?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  video:
    "https://images.unsplash.com/photo-1527735095040-147bffb4cede?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  image:
    "https://images.unsplash.com/photo-1527735095040-147bffb4cede?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export default function HomePage() {
  const { recommendations, isLoading, error } = useRecommendations({
    category: "music",
    limit: 5,
  });

  const mlRecommendations = recommendations.map((rec) => ({
    id: rec.id,
    title: `Creator ${rec.talentId}`,
    subtitle: `${(rec as { mediaType?: string }).mediaType || "media"} · ranked by ML visibility score`,
    image:
      PLACEHOLDER_IMAGES[
        (rec as { mediaType?: string }).mediaType || "image"
      ] || PLACEHOLDER_IMAGES.image,
    matchScore: rec.matchScore,
    reason: rec.reason || "Matched by ML visibility scoring engine",
    factors: [
      { label: "Visibility Score", value: rec.matchScore },
      {
        label: "Quality Match",
        value: Math.min(100, rec.matchScore + 3),
      },
      {
        label: "Sector Fit",
        value: Math.max(0, rec.matchScore - 5),
      },
      {
        label: "Fairness Approved",
        value: (rec as { visibilityApproved?: boolean }).visibilityApproved
          ? 100
          : 40,
      },
    ],
  }));

  const activeRecommendations = [...mlRecommendations]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  const renderSidebar = () => (
    <>
      <div className="rounded-2xl bg-card/80 backdrop-blur-md border border-white/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Trending Now</h2>
        </div>

        <div className="space-y-4">
          {mockTrending.map((item) => (
            <a
              key={item.id}
              href={`/talents/${item.creatorId}`}
              className="block group"
            >
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {item.creatorName}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <Button variant="secondary" className="w-full mt-4">
          View All Trending
        </Button>
      </div>
    </>
  );

  return (
    <FeedLayout sidebarContent={renderSidebar()}>
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">
            AI-Powered Recommendations
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading ML-scored recommendations...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
            Could not load recommendations: {error}
          </div>
        ) : activeRecommendations.length > 0 ? (
          <div className="space-y-4">
            {activeRecommendations.map((recommendation, index) => (
              <div key={recommendation.id}>
                <div className="text-xs uppercase tracking-wider text-cyan-300 mb-2">
                  Rank #{index + 1} • Score {recommendation.matchScore}
                </div>
                <AIRecommendationCard
                  {...recommendation}
                  onAccept={() => {}}
                  onReject={() => {}}
                  isPriority={index === 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-card/60 p-6 text-muted-foreground">
            No scored media yet. Upload portfolio items to generate ML
            visibility scores.
          </div>
        )}
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-white">Trending Now</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockTrending.map((item) => (
            <MediaCard key={item.id} {...item} variant="featured" />
          ))}
        </div>

        <Button variant="secondary" className="w-full mt-6">
          View All Trending
        </Button>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Featured Creators
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockFeaturedCreators.map((creator) => (
            <CreatorCard key={creator.id} {...creator} />
          ))}
        </div>
      </div>
    </FeedLayout>
  );
}
