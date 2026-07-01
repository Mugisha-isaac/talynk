import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const talent = await prisma.creator.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!talent) {
    return NextResponse.json({ error: 'Talent not found' }, { status: 404 });
  }

  return NextResponse.json(talent);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { discipline, bio, location, gender } = body as {
    discipline?: 'MUSIC' | 'VISUAL_ARTS' | 'COMEDY' | 'ATHLETICS' | 'PERFORMING_ARTS';
    bio?: string;
    location?: string;
    gender?: string;
  };

  const talent = await prisma.creator.update({
    where: { id: params.id },
    data: {
      ...(discipline !== undefined && { discipline }),
      ...(bio !== undefined && { bio }),
      ...(location !== undefined && { location }),
      ...(gender !== undefined && { gender }),
    },
  });

  return NextResponse.json(talent);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const talent = await prisma.creator.findUnique({ where: { id: params.id } });
  if (!talent) {
    return NextResponse.json({ error: 'Talent not found' }, { status: 404 });
  }

  await prisma.creator.delete({ where: { id: params.id } });
  await prisma.user.update({
    where: { id: talent.userId },
    data: { userType: 'AUDIENCE' },
  });

  return NextResponse.json({ success: true });
}
