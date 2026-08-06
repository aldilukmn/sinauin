import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic'; // Disable Next.js caching so it always fetches fresh data from Redis

// Only initialize Redis if we have the environment variables
const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }) 
  : null;

const REDIS_KEY = 'sinauin_nisn_print_count';

export async function GET() {
  try {
    if (!redis) {
      // Mock data if no redis config exists yet
      return NextResponse.json({ count: 12450 });
    }

    const count = await redis.get(REDIS_KEY);
    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('Failed to get print count:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!redis) {
      // Mock success if no redis config
      return NextResponse.json({ success: true, count: 12450 });
    }

    const body = await request.json().catch(() => ({ nisnList: [] }));
    let incrementAmount = 0;

    if (body.nisnList && Array.isArray(body.nisnList) && body.nisnList.length > 0) {
      // Create a pipeline to send all SETNX commands in one go for maximum performance
      const pipeline = redis.pipeline();
      
      // Limit to max 200 per request to prevent abuse
      const safeList = body.nisnList.slice(0, 200);
      
      safeList.forEach((nisn: string) => {
        // Expiration is 86400 seconds = 24 hours
        pipeline.set(`printed_${nisn}`, "1", { nx: true, ex: 86400 });
      });

      // Execute pipeline
      const results = await pipeline.exec();
      
      // Count how many SET commands were successful (returned "OK")
      // In Upstash Redis, successful SET NX returns "OK" or 1, failed returns null
      incrementAmount = results.filter(res => res !== null).length;
    } else {
      // Fallback if no nisnList provided, just for safety
      const fallbackIncrement = typeof body.increment === 'number' ? body.increment : 1;
      incrementAmount = Math.min(Math.max(1, fallbackIncrement), 200);
    }

    if (incrementAmount > 0) {
      const newCount = await redis.incrby(REDIS_KEY, incrementAmount);
      return NextResponse.json({ success: true, count: newCount, added: incrementAmount });
    } else {
      // All NISNs were already printed within 24 hours
      const currentCount = await redis.get(REDIS_KEY);
      return NextResponse.json({ success: true, count: currentCount, added: 0 });
    }
  } catch (error) {
    console.error('Failed to update print count:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
