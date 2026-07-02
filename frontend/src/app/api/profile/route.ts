// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decodeTokenUserId } from '@/lib/jwt';
import { uploadToCloudinary } from '@/lib/cloudinary';

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

// PATCH /api/profile - Update the current user's username and/or profile picture.
// Accepts multipart/form-data with optional "username" text field and optional
// "avatar" file field so both can be updated in a single request.
export async function PATCH(request: NextRequest) {
  const token = request.cookies.get('talynk_token')?.value;
  const userId = token ? decodeTokenUserId(token) : null;

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing || existing.deletedAt) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const usernameRaw = formData.get('username');
    const avatarFile = formData.get('avatar');

    const data: { username?: string; profilePicture?: string } = {};

    if (typeof usernameRaw === 'string' && usernameRaw.trim()) {
      const username = usernameRaw.trim();

      if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(username)) {
        return NextResponse.json(
          { error: 'Username must be 3-30 characters (letters, numbers, _ . -).' },
          { status: 400 }
        );
      }

      if (username !== existing.username) {
        const taken = await prisma.user.findUnique({ where: { username } });
        if (taken) {
          return NextResponse.json({ error: 'That username is already taken.' }, { status: 409 });
        }
        data.username = username;
      }
    }

    if (avatarFile instanceof File && avatarFile.size > 0) {
      const uploaded = await uploadToCloudinary(avatarFile, {
        folder: `talynk/avatars/${userId}`,
        resourceType: 'image',
      });
      data.profilePicture = uploaded.url;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return NextResponse.json({
      id: updated.id,
      email: updated.email,
      username: updated.username,
      avatarUrl: updated.profilePicture,
    });
  } catch (error) {
    console.error('PATCH /api/profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}