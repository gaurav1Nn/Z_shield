/**
 * ZShield API Response Utilities
 * Standardized response format for all API endpoints
 */

import { NextResponse } from 'next/server';
import { AppError, isAppError, toAppError } from '@/lib/errors';
import { logger } from './logger';

interface SuccessResponse<T> {
    success: true;
    data: T;
    meta?: {
        timestamp: string;
        requestId?: string;
    };
}

interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
    meta?: {
        timestamp: string;
        requestId?: string;
    };
}

type APIResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Create a success response
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse<SuccessResponse<T>> {
    const response: SuccessResponse<T> = {
        success: true,
        data,
        meta: {
            timestamp: new Date().toISOString(),
        },
    };

    return NextResponse.json(response, { status });
}

/**
 * Create an error response
 */
export function apiError(error: Error | AppError | unknown, statusCode?: number): NextResponse<ErrorResponse> {
    const appError = isAppError(error) ? error : toAppError(error);
    const status = statusCode || appError.statusCode;

    logger.error(`API Error: ${appError.message}`, appError);

    const response: ErrorResponse = {
        success: false,
        error: {
            code: appError.code,
            message: appError.message,
            details: appError.details,
        },
        meta: {
            timestamp: new Date().toISOString(),
        },
    };

    return NextResponse.json(response, { status });
}

/**
 * Create a 201 Created response
 */
export function apiCreated<T>(data: T): NextResponse<SuccessResponse<T>> {
    return apiSuccess(data, 201);
}

/**
 * Create a 204 No Content response
 */
export function apiNoContent(): NextResponse {
    return new NextResponse(null, { status: 204 });
}

/**
 * Create a paginated response
 */
export function apiPaginated<T>(
    items: T[],
    pagination: {
        total: number;
        limit: number;
        offset: number;
    }
): NextResponse<SuccessResponse<{ items: T[]; pagination: { total: number; limit: number; offset: number; hasMore: boolean } }>> {
    return apiSuccess({
        items,
        pagination: {
            ...pagination,
            hasMore: pagination.offset + items.length < pagination.total,
        },
    });
}

/**
 * Wrapper function for route handlers with automatic error handling
 */
export function withErrorHandling<T>(
    handler: () => Promise<NextResponse<T>>
): Promise<NextResponse<T | ErrorResponse>> {
    return handler().catch((error) => apiError(error));
}

export type { APIResponse, SuccessResponse, ErrorResponse };
