// src/app/api/talents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
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
          include: { qualityScore: true },
        },
      },
    });

    if (!creator) {
      return NextResponse.json(
        { success: false, error: 'Talent not found' },
        { status: 404 }
      );
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
        portfolio: creator.contentItems.map((item) => ({
          id: item.id,
          title: item.title,
          type: item.contentType,
          cover: item.mediaUrl,
          qualityScore: item.qualityScore?.overallScore ?? null,
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
