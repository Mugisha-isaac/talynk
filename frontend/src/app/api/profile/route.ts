// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decodeTokenUserId } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('talynk_token')?.value;
  const userId = token ? decodeTokenUserId(token) : null;

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      creator: { include: { _count: { select: { contentItems: true } } } },
      audienceMember: true,
    },
  });

  if (!user || user.deletedAt) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    username: user.username,
    avatarUrl: user.profilePicture,
    userType: user.userType,
    creator: user.creator
      ? {
          id: user.creator.id,
          bio: user.creator.bio,
          discipline: user.creator.discipline,
          location: user.creator.location,
          followerCount: user.creator.followerCount,
          visibilityScore: user.creator.visibilityScoreCurrent,
          portfolioCount: user.creator._count.contentItems,
        }
      : null,
    audienceMember: user.audienceMember
      ? { id: user.audienceMember.id, preferences: user.audienceMember.preferences }
      : null,
  });
}
