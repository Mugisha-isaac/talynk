// prisma/seed.ts
//
// Creates the platform's default superadmin account so there's always a way
// into /admin on a fresh database. Safe to run repeatedly (upserts).
//
// Run with: yarn prisma:seed  (or: npx prisma db seed)

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const KEY_LENGTH = 64;

function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

const SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME || 'superadmin';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'superadmin';
const SUPERADMIN_EMAIL =
  process.env.SUPERADMIN_EMAIL || 'superadmin@talynk.local';

async function main() {
  const existing = await prisma.user.findUnique({
    where: { username: SUPERADMIN_USERNAME },
  });

  if (existing) {
    console.log(
      `Superadmin "${SUPERADMIN_USERNAME}" already exists (id: ${existing.id}). Skipping.`
    );
    return;
  }

  const passwordHash = await hashPassword(SUPERADMIN_PASSWORD);

  const user = await prisma.user.create({
    data: {
      email: SUPERADMIN_EMAIL,
      username: SUPERADMIN_USERNAME,
      passwordHash,
      userType: 'ADMIN',
    },
  });

  console.log(
    `Created superadmin user "${SUPERADMIN_USERNAME}" (id: ${user.id}). ` +
      `Login with username/email "${SUPERADMIN_USERNAME}" or "${SUPERADMIN_EMAIL}" and password "${SUPERADMIN_PASSWORD}".`
  );
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
