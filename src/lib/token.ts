import crypto from 'crypto';

const SECRET_KEY = process.env.CAPTION_SECRET || 'default-secret-key-for-development';

function getSecretKey(): string {
  if (!process.env.CAPTION_SECRET) {
    console.warn('CAPTION_SECRET environment variable not set, using default key');
  }
  return SECRET_KEY;
}

export function encryptToken(data: string): string {
  const key = getSecretKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.padEnd(32, '0').slice(0, 32)), iv);
  let encrypted = cipher.update(data, 'utf-8', 'base64');
  encrypted += cipher.final('base64');
  return iv.toString('base64') + ':' + encrypted;
}

export function decryptToken(token: string): string {
  const key = getSecretKey();
  const [ivStr, encryptedData] = token.split(':');
  const iv = Buffer.from(ivStr, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.padEnd(32, '0').slice(0, 32)), iv);
  let decrypted = decipher.update(encryptedData, 'base64', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}