// src/app/api/talents/[id]/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decodeTokenUserId } from '@/lib/jwt';
import { getOrCreateAudienceMemberId } from '@/lib/audience';

// GET /api/talents/[id]/save - is the current viewer saving this talent?
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get('talynk_token')?.value;
  const userId = token ? decodeTokenUserId(token) : null;

  if (!userId) {
    return NextResponse.json({ saved: false });
  }

  try {
    const member = await prisma.audienceMember.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!member) {
      return NextResponse.json({ saved: false });
    }

    const follow = await prisma.follow.findUnique({
      where: { followerId_creatorId: { followerId: member.id, creatorId: params.id } },
    });

    return NextResponse.json({ saved: !!follow });
  } catch (error) {
    console.error('GET /api/talents/[id]/save error:', error);
    return NextResponse.json({ error: 'Failed to load save status' }, { status: 500 });
  }
}

// POST /api/talents/[id]/save - toggle save (follow) for the current user
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get('talynk_token')?.value;
  const userId = token ? decodeTokenUserId(token) : null;

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const creator = await prisma.creator.findUnique({ where: { id: params.id } });
    if (!creator) {
      return NextResponse.json({ error: 'Talent not found' }, { status: 404 });
    }

    const audienceMemberId = await getOrCreateAudienceMemberId(userId);

    const existing = await prisma.follow.findUnique({
      where: { followerId_creatorId: { followerId: audienceMemberId, creatorId: params.id } },
    });

    let saved: boolean;
    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      saved = false;
    } else {
      await prisma.follow.create({
        data: { followerId: audienceMemberId, creatorId: params.id },
      });
      saved = true;
    }

    const followerCount = await prisma.follow.count({ where: { creatorId: params.id } });

    // Keep the cached follower count on Creator in sync for listings that
    // display it without a join.
    await prisma.creator.update({
      where: { id: params.id },
      data: { followerCount },
    });

    return NextResponse.json({ saved, followerCount });
  } catch (error) {
    console.error('POST /api/talents/[id]/save error:', error);
    return NextResponse.json({ error: 'Failed to update save status' }, { status: 500 });
  }
}