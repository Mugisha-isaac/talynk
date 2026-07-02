// src/app/api/content/[id]/interactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decodeTokenUserId } from '@/lib/jwt';
import { getOrCreateAudienceMemberId } from '@/lib/audience';

async function getCounts(contentItemId: string, audienceMemberId?: string) {
  const [likeCount, shareCount, commentCount, viewCount, myLike] = await Promise.all([
    prisma.interaction.count({ where: { contentItemId, interactionType: 'LIKE' } }),
    prisma.interaction.count({ where: { contentItemId, interactionType: 'SHARE' } }),
    prisma.comment.count({ where: { contentItemId } }),
    prisma.interaction.count({ where: { contentItemId, interactionType: 'VIEW' } }),
    audienceMemberId
      ? prisma.interaction.findFirst({
          where: { contentItemId, audienceMemberId, interactionType: 'LIKE' },
          select: { id: true },
        })
      : null,
  ]);

  return {
    likeCount,
    shareCount,
    commentCount,
    viewCount,
    likedByMe: !!myLike,
  };
}

// GET /api/content/[id]/interactions - counts + whether the current viewer liked it
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('talynk_token')?.value;
    const userId = token ? decodeTokenUserId(token) : null;

    let audienceMemberId: string | undefined;
    if (userId) {
      const member = await prisma.audienceMember.findUnique({
        where: { userId },
        select: { id: true },
      });
      audienceMemberId = member?.id;
    }

    const counts = await getCounts(params.id, audienceMemberId);
    return NextResponse.json(counts);
  } catch (error) {
    console.error('GET /api/content/[id]/interactions error:', error);
    return NextResponse.json({ error: 'Failed to load interactions' }, { status: 500 });
  }
}

// POST /api/content/[id]/interactions - { type: 'LIKE' | 'SHARE' | 'VIEW' }
// LIKE toggles (create if absent, remove if present). SHARE/VIEW always log a new event.
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
    const body = await request.json().catch(() => ({}));
    const type = body?.type as 'LIKE' | 'SHARE' | 'VIEW' | undefined;

    if (!type || !['LIKE', 'SHARE', 'VIEW'].includes(type)) {
      return NextResponse.json({ error: 'type must be LIKE, SHARE, or VIEW' }, { status: 400 });
    }

    const contentItem = await prisma.contentItem.findUnique({ where: { id: params.id } });
    if (!contentItem) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const audienceMemberId = await getOrCreateAudienceMemberId(userId);

    if (type === 'LIKE') {
      const existing = await prisma.interaction.findFirst({
        where: { contentItemId: params.id, audienceMemberId, interactionType: 'LIKE' },
      });

      if (existing) {
        await prisma.interaction.delete({ where: { id: existing.id } });
      } else {
        await prisma.interaction.create({
          data: { contentItemId: params.id, audienceMemberId, interactionType: 'LIKE' },
        });
      }
    } else {
      await prisma.interaction.create({
        data: { contentItemId: params.id, audienceMemberId, interactionType: type },
      });
    }

    const counts = await getCounts(params.id, audienceMemberId);
    return NextResponse.json(counts);
  } catch (error) {
    console.error('POST /api/content/[id]/interactions error:', error);
    return NextResponse.json({ error: 'Failed to record interaction' }, { status: 500 });
  }
}