import crypto from 'crypto';

type VotingTokenPayload = {
  sub: string;
  role?: string;
  pro?: boolean;
  [key: string]: any;
};

const algorithm = 'aes-256-gcm';
const ivLength = 12;

const secretKey = crypto.createHash('sha256')
  .update(process.env.NEXTAUTH_SECRET!)
  .digest();

export function encryptVotingToken(payload: VotingTokenPayload): string {
  try {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    
    const plaintext = JSON.stringify(payload);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    
    // Combine IV + AuthTag + Encrypted data
    const result = Buffer.concat([iv, authTag, encrypted]);
    
    return result.toString('base64');
  } catch (err) {
    console.error('❌ Encryption failed:', err);
    throw err;
  }
}

export function decryptVotingToken(token: string): VotingTokenPayload {
  try {
    const data = Buffer.from(token, 'base64');

    if (data.length < ivLength + 16 + 1) {
      throw new Error('Token too short to contain IV + AuthTag + Ciphertext');
    }

    const iv = data.subarray(0, ivLength);
    const authTag = data.subarray(ivLength, ivLength + 16);
    const encrypted = data.subarray(ivLength + 16);

    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    const result = JSON.parse(decrypted.toString('utf8'));

    return result as VotingTokenPayload;
  } catch (err) {
    console.error('❌ Decryption failed:', err);
    throw err;
  }
}
