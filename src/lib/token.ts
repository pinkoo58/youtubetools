import crypto from 'crypto';

const SECRET_KEY = process.env.CAPTION_SECRET || 'default-secret-key-for-development';

// Log initialization in development
if (process.env.NODE_ENV === 'development') {
  console.info('Token encryption module initialized');
}

function getSecretKey(): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const hasSecret = Boolean(process.env.CAPTION_SECRET);
  
  if (!hasSecret && isDevelopment) {
    console.warn('CAPTION_SECRET environment variable not set, using default key');
  }
  
  return SECRET_KEY;
}

export function encryptToken(data: string): string {
  try {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid data for encryption');
    }
    
    const key = getSecretKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.padEnd(32, '0').slice(0, 32)), iv);
    let encrypted = cipher.update(data, 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    return iv.toString('base64') + ':' + encrypted;
  } catch (error) {
    console.error('Token encryption failed:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Token encryption failed');
  }
}

export function decryptToken(token: string): string {
  try {
    if (!token || typeof token !== 'string' || !token.includes(':')) {
      throw new Error('Invalid token format');
    }
    
    const key = getSecretKey();
    const [ivStr, encryptedData] = token.split(':');
    
    if (!ivStr || !encryptedData) {
      throw new Error('Invalid token structure');
    }
    
    const iv = Buffer.from(ivStr, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.padEnd(32, '0').slice(0, 32)), iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  } catch (error) {
    console.error('Token decryption failed:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Token decryption failed');
  }
}