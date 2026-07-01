'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/cards/StatCard';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Share2 } from 'lucide-react';

interface ProfileData {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  userType: 'CREATOR' | 'AUDIENCE' | 'ADMIN';
  creator: {
    id: string;
    bio: string | null;
    discipline: string;
    location: string | null;
    followerCount: number;
    visibilityScore: number;
    portfolioCount: number;
  } | null;
}

export default function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <MainLayout isAuthenticated={true} userRole="TALENT">
        <div className="p-6 text-slate-400">Loading profile...</div>
      </MainLayout>
    );
  }

  if (error || !profile) {
    return (
      <MainLayout isAuthenticated={false}>
        <div className="p-6 text-slate-400">
          {error || 'Please log in to view your profile.'}
        </div>
      </MainLayout>
    );
  }

  const creator = profile.creator;

  return (
    <MainLayout isAuthenticated={true} userRole={profile.userType === 'CREATOR' ? 'TALENT' : 'FAN'}>
      <div className="space-y-6">
        <PageHeader title="Creator Profile" description="View and manage your creative profile" />

        <div className="grid gap-4">
          <Card variant="premium">
            <div className="p-6 flex items-center gap-4">
              <Avatar
                src={profile.avatarUrl || undefined}
                alt={profile.username}
                size="lg"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
                <p className="text-slate-400">{profile.email}</p>
                {creator && (
                  <div className="flex gap-2 mt-2">
                    <Badge variant="primary" size="sm">{creator.discipline}</Badge>
                    {creator.location && (
                      <Badge variant="primary" size="sm">{creator.location}</Badge>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsFollowing(!isFollowing)}
                  variant={isFollowing ? 'secondary' : 'primary'}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button variant="secondary">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </Card>

          {creator ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Followers" value={creator.followerCount.toLocaleString()} color="blue" />
              <StatCard title="Visibility score" value={creator.visibilityScore.toFixed(1)} color="purple" />
              <StatCard title="Content" value={creator.portfolioCount.toString()} color="green" />
              <StatCard title="Discipline" value={creator.discipline} color="red" />
            </div>
          ) : (
            <p className="text-slate-400">
              This account doesn't have a creator profile yet.
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
