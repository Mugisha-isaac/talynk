import { NextRequest } from 'next/server';
import { decodeTokenUserId } from './jwt';

export function resolveUserId(
  request: NextRequest,
  fallbackUserId?: string | null
): string {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const userId = decodeTokenUserId(authHeader.slice(7));
    if (userId) return userId;
  }

  const headerUserId = request.headers.get('x-user-id');
  if (headerUserId) return headerUserId;

  const queryUserId = request.nextUrl.searchParams.get('userId');
  if (queryUserId) return queryUserId;

  if (fallbackUserId) return fallbackUserId;

  return 'dev-user';
}
