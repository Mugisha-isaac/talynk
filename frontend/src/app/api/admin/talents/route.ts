import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const talents = await prisma.creator.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    data: talents.map((talent) => ({
      id: talent.id,
      userId: talent.userId,
      name: talent.user.username,
      email: talent.user.email,
      discipline: talent.discipline,
      bio: talent.bio,
      location: talent.location,
      followerCount: talent.followerCount,
      visibilityScoreCurrent: talent.visibilityScoreCurrent,
      createdAt: talent.createdAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { userId, discipline, bio, location, gender } = body as {
    userId: string;
    discipline: 'MUSIC' | 'VISUAL_ARTS' | 'COMEDY' | 'ATHLETICS' | 'PERFORMING_ARTS';
    bio?: string;
    location?: string;
    gender?: string;
  };

  if (!userId || !discipline) {
    return NextResponse.json({ error: 'userId and discipline are required' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { userType: 'CREATOR' },
  });

  const talent = await prisma.creator.create({
    data: { userId, discipline, bio, location, gender },
  });

  return NextResponse.json(talent, { status: 201 });
}
