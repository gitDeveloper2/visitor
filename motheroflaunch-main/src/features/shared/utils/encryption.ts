import crypto from 'crypto';

const algorithm = 'aes-256-gcm'; // secure and modern
const secretKey = crypto.createHash('sha256').update(process.env.BETTER_AUTH_SECRET!).digest(); // 32 bytes
const ivLength = 12; // recommended for GCM

export function encryptVotingToken(payload: object): string {
 
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const json = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Return iv + encrypted + tag as base64 string
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}
