// app/api/elevation/route.ts
import { redis } from '@/features/shared/lib/redis';
import { NextRequest, NextResponse } from 'next/server';

// Load constants from environment, fallback to defaults
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 15;
const WINDOW_SECONDS = Number(process.env.RATE_LIMIT_WINDOW_SECONDS) || 60;

export async function POST(req: NextRequest) {
  try {
    // Get client IP address
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    const key = `rate-limit:elevation:${ip}`;

    // Apply rate limiting using Redis
    const wasSet = await redis.set(key, 1, { ex: WINDOW_SECONDS, nx: true });

    if (!wasSet) {
      const current = await redis.incr(key);
      if (current > MAX_REQUESTS) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Try again in a minute.' },
          { status: 429 }
        );
      }
    }

    // Parse and validate coordinates
    const { lat, lng } = await req.json();

    if (
      typeof lat !== 'number' || typeof lng !== 'number' ||
      isNaN(lat) || isNaN(lng) ||
      lat < -90 || lat > 90 || lng < -180 || lng > 180
    ) {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }

    // Call external elevation API
    const res = await fetch(
      `https://api.elevationapi.com/api/Elevation?lat=${lat}&lon=${lng}&dataSet=SRTM_GL3`
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Elevation API failed' }, { status: res.status });
    }

    const data = await res.json();
    const elevation = data?.geoPoints?.[0]?.elevation;

    if (typeof elevation !== 'number') {
      return NextResponse.json({ error: 'Invalid elevation data' }, { status: 500 });
    }

    return NextResponse.json({ elevation });
  } catch (error) {
    console.error('Elevation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
