import crypto from 'crypto';

const DEFAULT_SECRET =
  'your-shared-nextauth-jwt-token-secret-key-12345';

function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function getJwtSecret(): string {
  return (
    process.env.JWT_SECRET_KEY ||
    process.env.NEXTAUTH_SECRET ||
    DEFAULT_SECRET
  );
}

export function signServiceToken(
  userId: string,
  expiresInSeconds = 3600
): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(
    JSON.stringify({
      user_id: userId,
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    })
  );
  const signature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${header}.${payload}.${signature}`;
}

export function decodeTokenUserId(token: string): string | null {
  try {
    const [, payloadSegment] = token.split('.');
    if (!payloadSegment) return null;
    const payload = JSON.parse(
      Buffer.from(
        payloadSegment.replace(/-/g, '+').replace(/_/g, '/'),
        'base64'
      ).toString('utf8')
    );
    return payload.user_id || payload.sub || null;
  } catch {
    return null;
  }
}
