// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decodeTokenUserId } from '@/lib/jwt';
import { UserRole } from '@/types';

function toUserRole(
  userType: string,
  audiencePreferences?: Record<string, unknown> | null
): UserRole {
  if (userType === 'CREATOR') return UserRole.TALENT;
  if (userType === 'ADMIN') return UserRole.ADMIN;

  if (
    audiencePreferences &&
    typeof audiencePreferences === 'object' &&
    audiencePreferences.accountRole === UserRole.SPONSOR
  ) {
    return UserRole.SPONSOR;
  }

  return UserRole.FAN;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('talynk_token')?.value;
  const userId = token ? decodeTokenUserId(token) : null;

  if (!userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { audienceMember: true },
  });
  if (!user || user.deletedAt) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.username,
      role: toUserRole(user.userType, user.audienceMember?.preferences as Record<string, unknown> | null),
      avatarUrl: user.profilePicture,
      createdAt: user.createdAt,
    },
  });
}
