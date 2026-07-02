import { prisma } from '@/lib/prisma';

/**
 * Interactions (likes, comments, shares) and Follows (saves) are modeled
 * against AudienceMember, not User directly. Talents and sponsors don't
 * necessarily have one yet, so this lazily creates it on first interaction
 * for whichever authenticated user needs it.
 */
export async function getOrCreateAudienceMemberId(userId: string): Promise<string> {
  const existing = await prisma.audienceMember.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await prisma.audienceMember.create({
    data: { userId },
    select: { id: true },
  });
  return created.id;
}