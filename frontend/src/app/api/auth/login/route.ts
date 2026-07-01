// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { signServiceToken } from '@/lib/jwt';
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

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const identifier = (email || '').trim();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
      include: { audienceMember: true },
    });
    if (!user || user.deletedAt) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = signServiceToken(user.id);

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.username,
        role: toUserRole(user.userType, user.audienceMember?.preferences as Record<string, unknown> | null),
        avatarUrl: user.profilePicture,
        createdAt: user.createdAt,
      },
    });

    response.cookies.set('talynk_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
