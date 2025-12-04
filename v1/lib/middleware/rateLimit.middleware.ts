/**
 * ZShield Rate Limit Middleware
 * In-memory rate limiting for API protection
 */

import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/config';
import { apiError } from '@/lib/utils/response';
import { RateLimitError } from '@/lib/errors';
import { logger } from '@/lib/utils/logger';

interface RateLimitEntry {
    count: number;
    firstRequest: number;
    lastRequest: number;
}

// In-memory rate limit store (would be Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every minute
let cleanupInterval: NodeJS.Timeout | null = null;

function startCleanup() {
    if (cleanupInterval) return;

    cleanupInterval = setInterval(() => {
        const now = Date.now();
        const windowMs = config.rateLimit.windowMs;

        for (const [key, entry] of rateLimitStore.entries()) {
            if (now - entry.firstRequest > windowMs) {
                rateLimitStore.delete(key);
            }
        }

        logger.debug(`Rate limit cleanup: ${rateLimitStore.size} entries remaining`);
    }, 60000); // Cleanup every minute
}

// Start cleanup on module load
startCleanup();

/**
 * Extract client identifier from request
 */
function getClientId(request: NextRequest): string {
    // Try X-Forwarded-For first (for proxies/load balancers)
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    // Fall back to direct IP
    const ip = request.headers.get('x-real-ip');
    if (ip) {
        return ip;
    }

    // Use a hash of user-agent + accept-language as fallback
    const ua = request.headers.get('user-agent') || '';
    const lang = request.headers.get('accept-language') || '';
    return `anon:${simpleHash(ua + lang)}`;
}

/**
 * Simple hash function for string to number
 */
function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

/**
 * Check if request is rate limited
 */
function isRateLimited(clientId: string): { limited: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const { maxRequests, windowMs } = config.rateLimit;

    const entry = rateLimitStore.get(clientId);

    if (!entry) {
        // First request from this client
        rateLimitStore.set(clientId, {
            count: 1,
            firstRequest: now,
            lastRequest: now,
        });
        return { limited: false, remaining: maxRequests - 1, resetIn: windowMs };
    }

    // Check if window has expired
    if (now - entry.firstRequest > windowMs) {
        // Reset the window
        rateLimitStore.set(clientId, {
            count: 1,
            firstRequest: now,
            lastRequest: now,
        });
        return { limited: false, remaining: maxRequests - 1, resetIn: windowMs };
    }

    // Increment count
    entry.count++;
    entry.lastRequest = now;
    rateLimitStore.set(clientId, entry);

    const remaining = Math.max(0, maxRequests - entry.count);
    const resetIn = Math.max(0, windowMs - (now - entry.firstRequest));

    if (entry.count > maxRequests) {
        return { limited: true, remaining: 0, resetIn };
    }

    return { limited: false, remaining, resetIn };
}

type RouteHandler = (request: NextRequest, context?: { params: Record<string, string> }) => Promise<NextResponse>;

/**
 * Higher-order function that wraps route handlers with rate limiting
 * 
 * @example
 * export const GET = withRateLimit(async (request) => {
 *   return NextResponse.json({ data: 'Hello' });
 * });
 */
export function withRateLimit(handler: RouteHandler, customLimit?: { maxRequests: number; windowMs: number }) {
    return async (
        request: NextRequest,
        context?: { params: Record<string, string> }
    ): Promise<NextResponse> => {
        const clientId = getClientId(request);
        const { limited, remaining, resetIn } = isRateLimited(clientId);

        // Add rate limit headers to all responses
        const addRateLimitHeaders = (response: NextResponse): NextResponse => {
            response.headers.set('X-RateLimit-Limit', config.rateLimit.maxRequests.toString());
            response.headers.set('X-RateLimit-Remaining', remaining.toString());
            response.headers.set('X-RateLimit-Reset', Math.ceil(resetIn / 1000).toString());
            return response;
        };

        if (limited) {
            logger.warn(`Rate limit exceeded for client: ${clientId}`);

            const response = apiError(
                new RateLimitError('Too many requests. Please try again later.'),
                429
            );

            response.headers.set('Retry-After', Math.ceil(resetIn / 1000).toString());
            return addRateLimitHeaders(response);
        }

        const response = await handler(request, context);
        return addRateLimitHeaders(response);
    };
}

/**
 * Compose multiple middleware functions
 */
export function compose(...middlewares: ((handler: RouteHandler) => RouteHandler)[]) {
    return (handler: RouteHandler): RouteHandler => {
        return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
    };
}

/**
 * Get current rate limit stats (for debugging/monitoring)
 */
export function getRateLimitStats(): { totalClients: number; entries: Array<{ clientId: string; count: number }> } {
    const entries: Array<{ clientId: string; count: number }> = [];

    for (const [clientId, entry] of rateLimitStore.entries()) {
        entries.push({ clientId, count: entry.count });
    }

    return {
        totalClients: rateLimitStore.size,
        entries: entries.slice(0, 10), // Only return first 10
    };
}
