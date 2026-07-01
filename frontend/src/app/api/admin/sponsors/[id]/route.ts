import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const sponsor = await prisma.user.findUnique({
    where: { id: params.id },
    include: { audienceMember: true },
  });

  if (!sponsor || sponsor.deletedAt) {
    return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
  }

  return NextResponse.json(sponsor);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { email, username, companyName, sectors } = body as {
    email?: string;
    username?: string;
    companyName?: string;
    sectors?: string[];
  };

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: {
      ...(email !== undefined && { email }),
      ...(username !== undefined && { username }),
      userType: 'AUDIENCE',
      audienceMember: {
        upsert: {
          create: {
            preferences: {
              accountRole: 'SPONSOR',
              companyName: companyName || username || 'Sponsor',
              sectors: sectors || [],
            },
          },
          update: {
            preferences: {
              accountRole: 'SPONSOR',
              companyName: companyName || username || 'Sponsor',
              sectors: sectors || [],
            },
          },
        },
      },
    },
    include: { audienceMember: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  await prisma.user.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
