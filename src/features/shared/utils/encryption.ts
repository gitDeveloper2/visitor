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

export function decryptVotingToken(token: string): object {
  const buffer = Buffer.from(token, 'base64');
  const iv = buffer.subarray(0, ivLength);
  const authTag = buffer.subarray(ivLength, ivLength + 16); // GCM auth tag is 16 bytes
  const encryptedText = buffer.subarray(ivLength + 16);

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8'));
}