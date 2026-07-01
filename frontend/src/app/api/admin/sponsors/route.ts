import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { requireAdmin } from '@/lib/admin-auth';

function isSponsorPreference(preferences: unknown): boolean {
  if (!preferences || typeof preferences !== 'object') {
    return false;
  }

  return (preferences as Record<string, unknown>).accountRole === 'SPONSOR';
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const audienceUsers = await prisma.user.findMany({
    where: {
      userType: 'AUDIENCE',
      deletedAt: null,
      audienceMember: { isNot: null },
    },
    include: { audienceMember: true },
    orderBy: { createdAt: 'desc' },
  });

  const sponsors = audienceUsers.filter((user) =>
    isSponsorPreference(user.audienceMember?.preferences)
  );

  return NextResponse.json({
    data: sponsors.map((sponsor) => ({
      id: sponsor.id,
      audienceMemberId: sponsor.audienceMember?.id,
      email: sponsor.email,
      username: sponsor.username,
      preferences: sponsor.audienceMember?.preferences || {},
      createdAt: sponsor.createdAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { email, username, password, companyName, sectors } = body as {
    email: string;
    username: string;
    password: string;
    companyName?: string;
    sectors?: string[];
  };

  if (!email || !username || !password) {
    return NextResponse.json({ error: 'email, username and password are required' }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  const sponsor = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      userType: 'AUDIENCE',
      audienceMember: {
        create: {
          preferences: {
            accountRole: 'SPONSOR',
            companyName: companyName || username,
            sectors: sectors || [],
          },
        },
      },
    },
    include: { audienceMember: true },
  });

  return NextResponse.json(sponsor, { status: 201 });
}
