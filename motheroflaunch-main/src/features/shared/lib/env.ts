type EnvVars = {
  // ───── CORE ─────
  NODE_ENV: 'development' | 'production' | 'test';
  APP_URL: string;

  // ───── DATABASE ─────
  MONGODB_URI: string;
  MONGODB_DATABASE:string;
  MONGODB_URI_VOTES:string;
  MONGODB_DATABASE_VOTES:string
  // ───── REDIS ─────
  REDIS_URL: string;
};



const raw = process.env;

function parseEnv(): EnvVars {
  return {
    NODE_ENV: getEnum(raw.NODE_ENV, ['development', 'production', 'test'], 'NODE_ENV'),
    APP_URL: getString('APP_URL'),

    MONGODB_URI: getString('MONGODB_URI'),

    REDIS_URL: getString('REDIS_URL'),
    MONGODB_DATABASE:getString("MONGODB_DATABASE"),
    MONGODB_DATABASE_VOTES:getString("MONGODB_DATABASE_VOTES"),
    MONGODB_URI_VOTES:getString("MONGODB_URI_VOTES"),
  };
}

// ────── Helpers ──────
function getString(name: keyof EnvVars): string {
  const val = raw[name];
  if (!val) throw new Error(`Missing env: ${name}`);
  return val;
}

function getOptionalString(name: keyof EnvVars): string | undefined {
  return raw[name] || undefined;
}

function getNumber(name: keyof EnvVars): number {
  const val = raw[name];
  const num = Number(val);
  if (!val || isNaN(num)) throw new Error(`Env ${name} must be a number`);
  return num;
}

function getBoolean(name: keyof EnvVars): boolean {
  const val = raw[name];
  if (val === 'true') return true;
  if (val === 'false') return false;
  throw new Error(`Env ${name} must be "true" or "false"`);
}

function getEnum<T extends string>(
  val: string | undefined,
  allowed: T[],
  name: string
): T {
  if (!val || !allowed.includes(val as T)) {
    throw new Error(`Env ${name} must be one of: ${allowed.join(', ')}`);
  }
  return val as T;
}

// ────── Export ──────
export const env: EnvVars = parseEnv();
