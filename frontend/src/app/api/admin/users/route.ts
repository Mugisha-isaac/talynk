import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    include: { creator: true, audienceMember: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    data: users.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      userType: user.userType,
      createdAt: user.createdAt,
      creatorId: user.creator?.id || null,
      audienceMemberId: user.audienceMember?.id || null,
    })),
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { email, username, password, userType } = body as {
    email: string;
    username: string;
    password: string;
    userType: 'CREATOR' | 'AUDIENCE' | 'ADMIN';
  };

  if (!email || !username || !password || !userType) {
    return NextResponse.json({ error: 'email, username, password and userType are required' }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

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
          create: {
            preferences: { accountRole: 'FAN' },
          },
        },
      }),
    },
  });

  return NextResponse.json(user, { status: 201 });
}
