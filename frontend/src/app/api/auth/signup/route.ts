// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { signServiceToken } from '@/lib/jwt';
import { UserRole } from '@/types';

// Frontend UserRole -> Prisma UserType. Schema only has CREATOR/AUDIENCE/ADMIN,
// so SPONSOR/MODERATOR/FAN all fall back to AUDIENCE.
function toUserType(role: UserRole): 'CREATOR' | 'AUDIENCE' | 'ADMIN' {
  if (role === UserRole.TALENT) return 'CREATOR';
  if (role === UserRole.ADMIN) return 'ADMIN';
  return 'AUDIENCE';
}

function audiencePreferencesForRole(role: UserRole) {
  if (role === UserRole.SPONSOR) {
    return { accountRole: UserRole.SPONSOR };
  }

  return { accountRole: UserRole.FAN };
}

function slugifyUsername(name: string, email: string): string {
  const base = (name || email.split('@')[0])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${base || 'user'}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body as {
      name: string;
      email: string;
      password: string;
      role: UserRole;
    };

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'name, email, password and role are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const userType = toUserType(role);
    const username = slugifyUsername(name, email);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        userType,
        ...(userType === 'CREATOR' && {
          creator: {
            create: {
              discipline: 'MUSIC',
            },
          },
        }),
        ...(userType === 'AUDIENCE' && {
          audienceMember: {
            create: { preferences: audiencePreferencesForRole(role) },
          },
        }),
      },
      include: { creator: true, audienceMember: true },
    });

    const token = signServiceToken(user.id);

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name,
          role,
          avatarUrl: user.profilePicture,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );

    response.cookies.set('talynk_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('POST /api/auth/signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
