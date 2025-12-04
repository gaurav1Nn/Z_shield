/**
 * ZShield Custom Error Classes
 * Structured error handling for the API
 */

export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: unknown;

    constructor(
        message: string,
        code: string = 'INTERNAL_ERROR',
        statusCode: number = 500,
        isOperational: boolean = true,
        details?: unknown
    ) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, 'VALIDATION_ERROR', 400, true, details);
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 'AUTHENTICATION_ERROR', 401, true);
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Insufficient permissions') {
        super(message, 'AUTHORIZATION_ERROR', 403, true);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, 'NOT_FOUND', 404, true);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 'CONFLICT', 409, true);
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = 'Too many requests') {
        super(message, 'RATE_LIMIT_EXCEEDED', 429, true);
    }
}

export class ExternalServiceError extends AppError {
    constructor(service: string, message: string) {
        super(`${service}: ${message}`, 'EXTERNAL_SERVICE_ERROR', 502, true);
    }
}

export class QuoteExpiredError extends AppError {
    constructor() {
        super('Quote has expired. Please request a new quote.', 'QUOTE_EXPIRED', 400, true);
    }
}

export class InsufficientBalanceError extends AppError {
    constructor(token: string) {
        super(`Insufficient ${token} balance`, 'INSUFFICIENT_BALANCE', 400, true);
    }
}

export class InvalidAddressError extends AppError {
    constructor(addressType: string = 'address') {
        super(`Invalid ${addressType} format`, 'INVALID_ADDRESS', 400, true);
    }
}

/**
 * Check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
}

/**
 * Convert unknown error to AppError
 */
export function toAppError(error: unknown): AppError {
    if (isAppError(error)) {
        return error;
    }

    if (error instanceof Error) {
        return new AppError(error.message, 'UNKNOWN_ERROR', 500, false);
    }

    return new AppError(
        'An unexpected error occurred',
        'UNKNOWN_ERROR',
        500,
        false
    );
}
