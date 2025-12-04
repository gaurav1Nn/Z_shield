/**
 * ZShield API Type Definitions
 */

// Session type
export interface Session {
    sessionId: string;
    address: string;
    addressType: 'sapling' | 'unified' | 'transparent' | 'orchard';
    isShielded: boolean;
    walletType: string;
    connectedAt: string;
    expiresAt: string;
    lastActivityAt: string;
}

// Generic API response types
export interface APISuccessResponse<T> {
    success: true;
    data: T;
    meta?: {
        timestamp: string;
        requestId?: string;
    };
}

export interface APIErrorResponse {
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

export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

// Pagination
export interface PaginationParams {
    limit: number;
    offset: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}

// Auth request/response types
export interface ConnectWalletRequest {
    address: string;
    walletType: 'zashi' | 'ywallet' | 'nighthawk' | 'zecwallet';
}

export interface ConnectWalletResponse {
    sessionId: string;
    address: string;
    addressType: string;
    isShielded: boolean;
    connectedAt: string;
    expiresAt: string;
}

export interface DisconnectResponse {
    disconnected: boolean;
}
