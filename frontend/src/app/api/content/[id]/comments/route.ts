// src/app/api/content/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decodeTokenUserId } from '@/lib/jwt';

// GET /api/content/[id]/comments - latest 50 comments, oldest first
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: { contentItemId: params.id },
      orderBy: { createdAt: 'asc' },
      take: 50,
      include: { author: { select: { username: true, profilePicture: true } } },
    });

    return NextResponse.json(
      comments.map((c) => ({
        id: c.id,
        body: c.body,
        createdAt: c.createdAt,
        author: { username: c.author.username, avatarUrl: c.author.profilePicture },
      }))
    );
  } catch (error) {
    console.error('GET /api/content/[id]/comments error:', error);
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 });
  }
}

// POST /api/content/[id]/comments - { body: string }
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
    const payload = await request.json().catch(() => ({}));
    const text = typeof payload?.body === 'string' ? payload.body.trim() : '';

    if (!text) {
      return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 });
    }
    if (text.length > 1000) {
      return NextResponse.json({ error: 'Comment is too long (max 1000 characters)' }, { status: 400 });
    }

    const contentItem = await prisma.contentItem.findUnique({ where: { id: params.id } });
    if (!contentItem) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: { contentItemId: params.id, authorId: userId, body: text },
      include: { author: { select: { username: true, profilePicture: true } } },
    });

    return NextResponse.json(
      {
        id: comment.id,
        body: comment.body,
        createdAt: comment.createdAt,
        author: { username: comment.author.username, avatarUrl: comment.author.profilePicture },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/content/[id]/comments error:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}