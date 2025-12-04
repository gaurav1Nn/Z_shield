/**
 * ZShield Auth Middleware
 * Session verification for protected API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { Session } from '@/lib/types';
import { sessionRepository } from '@/lib/repositories/session.repository';
import { apiError } from '@/lib/utils/response';
import { AuthenticationError } from '@/lib/errors';
import { logger } from '@/lib/utils/logger';

export interface AuthenticatedRequest extends NextRequest {
    session: Session;
}

type AuthenticatedHandler = (
    request: NextRequest,
    session: Session,
    context?: { params: Record<string, string> }
) => Promise<NextResponse>;

/**
 * Higher-order function that wraps route handlers with session verification
 * 
 * @example
 * export const GET = withAuth(async (request, session) => {
 *   // session is verified and available
 *   return NextResponse.json({ data: session.address });
 * });
 */
export function withAuth(handler: AuthenticatedHandler) {
    return async (
        request: NextRequest,
        context?: { params: Record<string, string> }
    ): Promise<NextResponse> => {
        try {
            // Extract Authorization header
            const authHeader = request.headers.get('Authorization');

            if (!authHeader) {
                logger.warn('Missing Authorization header');
                return apiError(
                    new AuthenticationError('Authorization header required'),
                    401
                );
            }

            // Parse Bearer token
            const parts = authHeader.split(' ');
            if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
                logger.warn('Invalid Authorization header format');
                return apiError(
                    new AuthenticationError('Invalid authorization format. Use: Bearer <token>'),
                    401
                );
            }

            const sessionId = parts[1];

            if (!sessionId || sessionId.trim() === '') {
                logger.warn('Empty session token');
                return apiError(
                    new AuthenticationError('Session token is required'),
                    401
                );
            }

            // Verify session exists
            const session = await sessionRepository.findById(sessionId);

            if (!session) {
                logger.warn(`Session not found: ${sessionId.substring(0, 8)}...`);
                return apiError(
                    new AuthenticationError('Invalid or expired session'),
                    401
                );
            }

            // Check session expiration
            if (new Date(session.expiresAt) < new Date()) {
                logger.info(`Session expired: ${sessionId.substring(0, 8)}...`);
                await sessionRepository.delete(sessionId);
                return apiError(
                    new AuthenticationError('Session has expired. Please reconnect your wallet.'),
                    401
                );
            }

            // Session is valid - pass to handler
            logger.debug(`Authenticated request for: ${session.address.substring(0, 12)}...`);

            return handler(request, session, context);

        } catch (error) {
            logger.error('Auth middleware error:', error);

            if (error instanceof AuthenticationError) {
                return apiError(error, 401);
            }

            return apiError(
                new Error('Authentication failed'),
                500
            );
        }
    };
}

/**
 * Optional auth middleware - doesn't require authentication but passes session if available
 */
export function withOptionalAuth(
    handler: (request: NextRequest, session: Session | null) => Promise<NextResponse>
) {
    return async (request: NextRequest): Promise<NextResponse> => {
        try {
            const authHeader = request.headers.get('Authorization');

            if (!authHeader) {
                return handler(request, null);
            }

            const parts = authHeader.split(' ');
            if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
                return handler(request, null);
            }

            const sessionId = parts[1];
            const session = await sessionRepository.findById(sessionId);

            if (!session || new Date(session.expiresAt) < new Date()) {
                return handler(request, null);
            }

            return handler(request, session);

        } catch (error) {
            logger.error('Optional auth middleware error:', error);
            return handler(request, null);
        }
    };
}
