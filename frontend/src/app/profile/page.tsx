'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/cards/StatCard';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Share2 } from 'lucide-react';
import { UserRole, VerificationStatus, VerificationBadge } from '@/types';

const mockCreator = {
  id: 'creator-1',
  userId: 'user-1',
  user: {
    id: 'user-1',
    email: 'sarah@example.com',
    username: 'sarahartist',
    displayName: 'Sarah Artist',
    avatarUrl: 'https://via.placeholder.com/200',
    bio: 'Digital artist and illustrator',
    role: UserRole.TALENT,
    verificationStatus: VerificationStatus.VERIFIED,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  categories: ['Art', 'Digital', 'Design'],
  bioExtended: 'Digital artist and illustrator specializing in character design',
  isVerified: true,
  verificationBadge: VerificationBadge.VERIFIED,
  portfolioCount: 45,
  followersCount: 12500,
  followingCount: 834,
  likesCount: 89300,
  viewsCount: 2450000,
  aiVisibilityScore: 8.9,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date(),
};

export default function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <MainLayout isAuthenticated={true} userRole="TALENT">
      <div className="space-y-6">
        <PageHeader title="Creator Profile" description="View and manage your creative profile" />
        
        <div className="grid gap-4">
          <Card variant="premium">
            <div className="p-6 flex items-center gap-4">
              <Avatar
                src={mockCreator.user.avatarUrl}
                alt={mockCreator.user.displayName}
                size="lg"
                verified={mockCreator.isVerified}
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{mockCreator.user.displayName}</h1>
                <p className="text-slate-400">@{mockCreator.user.username}</p>
                <div className="flex gap-2 mt-2">
                  {mockCreator.categories.map((cat) => (
                    <Badge key={cat} variant="primary" size="sm">{cat}</Badge>
                  ))}
                </div>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Followers" value={mockCreator.followersCount.toLocaleString()} color="blue" />
            <StatCard title="Views" value={(mockCreator.viewsCount / 1000000).toFixed(1)} subtitle="M" color="purple" />
            <StatCard title="Likes" value={(mockCreator.likesCount / 1000).toFixed(0)} subtitle="K" color="red" />
            <StatCard title="Content" value={mockCreator.portfolioCount.toString()} color="green" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
