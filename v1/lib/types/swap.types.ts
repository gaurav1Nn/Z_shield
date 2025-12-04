/**
 * ZShield Swap Type Definitions
 */

import { TokenInfo } from './token.types';

// Swap status enum
export type SwapStatus =
    | 'pending_deposit'
    | 'confirming'
    | 'exchanging'
    | 'sending'
    | 'completed'
    | 'failed'
    | 'expired';

// Route step
export interface RouteStep {
    step: number;
    from: string;
    to: string;
    via: string;
    portion: string;
}

// Swap quote
export interface SwapQuote {
    quoteId: string;
    fromToken: TokenInfo;
    toToken: TokenInfo;
    fromAmount: string;
    toAmount: string;
    rate: string;
    rateInverse: string;
    priceImpact: string;
    fee: string;
    feeUSD: string;
    feePercent: string;
    route: RouteStep[];
    estimatedTime: string;
    expiresAt: string;
    privacyLevel: 'shielded' | 'transparent' | 'mixed';
    warnings: string[];
}

// Swap transaction
export interface SwapTransaction {
    swapId: string;
    sessionId: string;
    status: SwapStatus;
    statusMessage: string;
    progress: number;
    fromToken: string;
    toToken: string;
    fromAmount: string;
    toAmount: string;
    rate: string;
    fee: string;
    depositAddress: string;
    depositMemo?: string;
    destinationAddress: string;
    depositTxHash?: string;
    settleTxHash?: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    expiresAt: string;
}

// Request types
export interface SwapQuoteRequest {
    fromToken: string;
    toToken: string;
    fromAmount: string;
    slippage?: number;
}

export interface SwapExecuteRequest {
    quoteId: string;
    fromAddress: string;
    toAddress: string;
    fromToken: string;
    toToken: string;
    fromAmount: string;
}

// Response types
export interface SwapExecuteResponse {
    swapId: string;
    status: SwapStatus;
    depositAddress: string;
    depositMemo: string;
    expectedDeposit: string;
    expectedOutput: string;
    destinationAddress: string;
    expiresAt: string;
    createdAt: string;
    trackingUrl: string;
}

export interface SwapHistoryResponse {
    swaps: SwapTransaction[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}
