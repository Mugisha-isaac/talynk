import crypto from 'crypto';

const KEY_LENGTH = 64;

/**
 * Hash a plaintext password using scrypt (built into Node, no extra deps).
 * Stored format: "<salt-hex>:<hash-hex>"
 */
export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

export function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return resolve(false);
    crypto.scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(
        crypto.timingSafeEqual(Buffer.from(hash, 'hex'), derivedKey)
      );
    });
  });
}
