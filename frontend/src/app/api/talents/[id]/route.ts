// src/app/api/talents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decodeTokenUserId } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const creator = await prisma.creator.findFirst({
      where: {
        OR: [{ id: params.id }, { userId: params.id }],
      },
      include: {
        user: true,
        contentItems: {
          where: { status: 'PUBLISHED' },
          orderBy: { uploadDate: 'desc' },
          include: {
            qualityScore: true,
            _count: { select: { comments: true } },
            interactions: { where: { interactionType: { in: ['LIKE', 'SHARE'] } } },
          },
        },
      },
    });

    if (!creator) {
      return NextResponse.json(
        { success: false, error: 'Talent not found' },
        { status: 404 }
      );
    }

    // Which content items (if any) the current viewer has liked, and whether
    // they've saved this talent overall.
    const token = request.cookies.get('talynk_token')?.value;
    const userId = token ? decodeTokenUserId(token) : null;
    let likedContentIds = new Set<string>();
    let saved = false;

    if (userId) {
      const member = await prisma.audienceMember.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (member) {
        const [myLikes, follow] = await Promise.all([
          prisma.interaction.findMany({
            where: {
              audienceMemberId: member.id,
              interactionType: 'LIKE',
              contentItemId: { in: creator.contentItems.map((c) => c.id) },
            },
            select: { contentItemId: true },
          }),
          prisma.follow.findUnique({
            where: { followerId_creatorId: { followerId: member.id, creatorId: creator.id } },
          }),
        ]);
        likedContentIds = new Set(myLikes.map((l) => l.contentItemId));
        saved = !!follow;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: creator.id,
        name: creator.user.username,
        avatar: creator.user.profilePicture,
        category: creator.discipline,
        location: creator.location,
        bio: creator.bio,
        followers: creator.followerCount,
        visibilityScore: creator.visibilityScoreCurrent,
        saved,
        portfolio: creator.contentItems.map((item) => ({
          id: item.id,
          title: item.title,
          type: item.contentType,
          cover: item.mediaUrl,
          qualityScore: item.qualityScore?.overallScore ?? null,
          likeCount: item.interactions.filter((i) => i.interactionType === 'LIKE').length,
          shareCount: item.interactions.filter((i) => i.interactionType === 'SHARE').length,
          commentCount: item._count.comments,
          likedByMe: likedContentIds.has(item.id),
        })),
      },
    });
  } catch (error) {
    console.error('GET /api/talents/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch talent' },
      { status: 500 }
    );
  }
}