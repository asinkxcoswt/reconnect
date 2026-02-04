import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter
// For production with multiple instances, consider Redis-based solution (Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

function getRateLimitKey(req: NextRequest): string {
    // Use IP address as the key
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown';
    return ip;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
        // New window
        rateLimitMap.set(key, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW,
        });
        return { allowed: true, remaining: MAX_REQUESTS - 1 };
    }

    if (record.count >= MAX_REQUESTS) {
        return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: MAX_REQUESTS - record.count };
}

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
        if (now > record.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 5 * 60 * 1000);

export function middleware(request: NextRequest) {
    // Only rate limit API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const key = getRateLimitKey(request);
        const { allowed, remaining } = checkRateLimit(key);

        if (!allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': MAX_REQUESTS.toString(),
                        'X-RateLimit-Remaining': '0',
                        'Retry-After': '60',
                    },
                }
            );
        }

        // Add rate limit headers to response
        const response = NextResponse.next();
        response.headers.set('X-RateLimit-Limit', MAX_REQUESTS.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};
