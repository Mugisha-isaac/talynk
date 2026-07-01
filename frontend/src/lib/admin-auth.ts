import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decodeTokenUserId } from '@/lib/jwt';

export interface AdminAuthResult {
  userId: string;
}

export async function requireAdmin(request: NextRequest): Promise<AdminAuthResult | NextResponse> {
  const token = request.cookies.get('talynk_token')?.value;
  const userId = token ? decodeTokenUserId(token) : null;

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, userType: true, deletedAt: true },
  });

  if (!user || user.deletedAt) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (user.userType !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden: admin access required' }, { status: 403 });
  }

  return { userId: user.id };
}
