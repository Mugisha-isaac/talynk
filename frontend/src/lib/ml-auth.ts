const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const ML_ADMIN_USERNAME = process.env.ML_SERVICE_ADMIN_USERNAME || 'admin';
const ML_ADMIN_PASSWORD = process.env.ML_SERVICE_ADMIN_PASSWORD || 'admin';

let cachedToken: string | null = null;
let cachedTokenExpMs = 0;

function decodeJwtExpMs(token: string): number {
  try {
    const [, payload] = token.split('.');
    if (!payload) return 0;
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8')) as {
      exp?: number;
    };
    return decoded.exp ? decoded.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

function isTokenUsable(): boolean {
  if (!cachedToken) return false;

  const now = Date.now();
  return cachedTokenExpMs - now > 60_000;
}

export async function ensureMlServiceToken(): Promise<string> {
  if (isTokenUsable() && cachedToken) {
    return cachedToken;
  }

  const response = await fetch(`${ML_SERVICE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: ML_ADMIN_USERNAME,
      password: ML_ADMIN_PASSWORD,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`ML service login failed (${response.status}): ${errorBody}`);
  }

  const result = (await response.json()) as { access_token?: string };
  if (!result.access_token) {
    throw new Error('ML service login did not return access_token');
  }

  cachedToken = result.access_token;
  cachedTokenExpMs = decodeJwtExpMs(cachedToken);

  return cachedToken;
}
