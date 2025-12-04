"use client"

/**
 * ZShield Swap Hook
 * Frontend hook for swap operations including quotes, execution, and history
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Types
interface TokenInfo {
    symbol: string;
    name: string;
    icon: string;
}

interface RouteStep {
    step: number;
    from: string;
    to: string;
    via: string;
    portion: string;
}

interface SwapQuote {
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
    privacyLevel: string;
    warnings: string[];
}

interface SwapTransaction {
    swapId: string;
    status: 'pending_deposit' | 'confirming' | 'exchanging' | 'sending' | 'completed' | 'failed';
    statusMessage: string;
    progress: number;
    fromToken: string;
    toToken: string;
    fromAmount: string;
    toAmount: string;
    depositAddress: string;
    depositMemo?: string;
    depositTxHash?: string;
    settleTxHash?: string;
    destinationAddress: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
}

interface SwapState {
    quote: SwapQuote | null;
    currentSwap: SwapTransaction | null;
    swapHistory: SwapTransaction[];
    isLoadingQuote: boolean;
    isExecuting: boolean;
    isLoadingHistory: boolean;
    error: string | null;
    pagination: {
        total: number;
        hasMore: boolean;
    };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
const SESSION_KEY = 'zshield_session';
const QUOTE_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes
const STATUS_POLL_INTERVAL = 5000; // 5 seconds

/**
 * Get session token from localStorage
 */
const getStoredSession = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(SESSION_KEY);
};

export function useSwap() {
    const [state, setState] = useState<SwapState>({
        quote: null,
        currentSwap: null,
        swapHistory: [],
        isLoadingQuote: false,
        isExecuting: false,
        isLoadingHistory: false,
        error: null,
        pagination: {
            total: 0,
            hasMore: false,
        },
    });

    const quoteExpiryTimeout = useRef<NodeJS.Timeout | null>(null);
    const statusPollInterval = useRef<NodeJS.Timeout | null>(null);

    /**
     * Clear quote expiry timeout
     */
    const clearQuoteExpiry = useCallback(() => {
        if (quoteExpiryTimeout.current) {
            clearTimeout(quoteExpiryTimeout.current);
            quoteExpiryTimeout.current = null;
        }
    }, []);

    /**
     * Clear status polling interval
     */
    const clearStatusPoll = useCallback(() => {
        if (statusPollInterval.current) {
            clearInterval(statusPollInterval.current);
            statusPollInterval.current = null;
        }
    }, []);

    /**
     * Cleanup on unmount
     */
    useEffect(() => {
        return () => {
            clearQuoteExpiry();
            clearStatusPoll();
        };
    }, [clearQuoteExpiry, clearStatusPoll]);

    /**
     * Get swap quote
     */
    const getQuote = useCallback(async (
        fromToken: string,
        toToken: string,
        fromAmount: string,
        slippage: number = 0.5
    ): Promise<SwapQuote | null> => {
        setState(prev => ({ ...prev, isLoadingQuote: true, error: null }));
        clearQuoteExpiry();

        try {
            const response = await fetch(`${API_BASE}/swap/quote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fromToken,
                    toToken,
                    fromAmount,
                    slippage,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || 'Failed to get quote');
            }

            const quote = result.data as SwapQuote;

            setState(prev => ({
                ...prev,
                quote,
                isLoadingQuote: false,
            }));

            // Set quote expiry timer
            const expiresIn = new Date(quote.expiresAt).getTime() - Date.now();
            quoteExpiryTimeout.current = setTimeout(() => {
                setState(prev => ({ ...prev, quote: null }));
            }, Math.max(expiresIn, 0));

            return quote;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get quote';
            setState(prev => ({
                ...prev,
                isLoadingQuote: false,
                error: message,
            }));
            return null;
        }
    }, [clearQuoteExpiry]);

    /**
     * Execute swap
     */
    const executeSwap = useCallback(async (
        quoteId: string,
        fromAddress: string,
        toAddress: string
    ): Promise<SwapTransaction | null> => {
        const sessionId = getStoredSession();
        if (!sessionId) {
            setState(prev => ({ ...prev, error: 'Not connected. Please connect your wallet.' }));
            return null;
        }

        if (!state.quote || state.quote.quoteId !== quoteId) {
            setState(prev => ({ ...prev, error: 'Quote expired. Please get a new quote.' }));
            return null;
        }

        setState(prev => ({ ...prev, isExecuting: true, error: null }));

        try {
            const response = await fetch(`${API_BASE}/swap/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionId}`,
                },
                body: JSON.stringify({
                    quoteId,
                    fromAddress,
                    toAddress,
                    fromToken: state.quote.fromToken.symbol,
                    toToken: state.quote.toToken.symbol,
                    fromAmount: state.quote.fromAmount,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || 'Failed to execute swap');
            }

            const swap = result.data as SwapTransaction;

            setState(prev => ({
                ...prev,
                currentSwap: swap,
                quote: null, // Clear quote after execution
                isExecuting: false,
            }));

            clearQuoteExpiry();

            // Start polling for status updates
            startStatusPolling(swap.swapId);

            return swap;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to execute swap';
            setState(prev => ({
                ...prev,
                isExecuting: false,
                error: message,
            }));
            return null;
        }
    }, [state.quote, clearQuoteExpiry]);

    /**
     * Get swap status
     */
    const getSwapStatus = useCallback(async (swapId: string): Promise<SwapTransaction | null> => {
        try {
            const sessionId = getStoredSession();
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };

            if (sessionId) {
                headers['Authorization'] = `Bearer ${sessionId}`;
            }

            const response = await fetch(`${API_BASE}/swap/${swapId}`, {
                headers,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || 'Failed to get swap status');
            }

            const swap = result.data as SwapTransaction;

            setState(prev => ({
                ...prev,
                currentSwap: swap,
            }));

            // Stop polling if swap is completed or failed
            if (swap.status === 'completed' || swap.status === 'failed') {
                clearStatusPoll();
            }

            return swap;
        } catch (error) {
            console.error('Failed to get swap status:', error);
            return null;
        }
    }, [clearStatusPoll]);

    /**
     * Start polling for swap status updates
     */
    const startStatusPolling = useCallback((swapId: string) => {
        clearStatusPoll();

        statusPollInterval.current = setInterval(() => {
            getSwapStatus(swapId);
        }, STATUS_POLL_INTERVAL);
    }, [clearStatusPoll, getSwapStatus]);

    /**
     * Get swap history
     */
    const getHistory = useCallback(async (limit: number = 10, offset: number = 0): Promise<void> => {
        const sessionId = getStoredSession();
        if (!sessionId) {
            setState(prev => ({ ...prev, error: 'Not connected. Please connect your wallet.' }));
            return;
        }

        setState(prev => ({ ...prev, isLoadingHistory: true, error: null }));

        try {
            const response = await fetch(
                `${API_BASE}/swap/history?limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        'Authorization': `Bearer ${sessionId}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || 'Failed to get swap history');
            }

            setState(prev => ({
                ...prev,
                swapHistory: offset === 0
                    ? result.data.swaps
                    : [...prev.swapHistory, ...result.data.swaps],
                pagination: {
                    total: result.data.pagination.total,
                    hasMore: result.data.pagination.hasMore,
                },
                isLoadingHistory: false,
            }));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get history';
            setState(prev => ({
                ...prev,
                isLoadingHistory: false,
                error: message,
            }));
        }
    }, []);

    /**
     * Clear current quote
     */
    const clearQuote = useCallback(() => {
        clearQuoteExpiry();
        setState(prev => ({ ...prev, quote: null }));
    }, [clearQuoteExpiry]);

    /**
     * Clear current swap
     */
    const clearCurrentSwap = useCallback(() => {
        clearStatusPoll();
        setState(prev => ({ ...prev, currentSwap: null }));
    }, [clearStatusPoll]);

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    return {
        // State
        quote: state.quote,
        currentSwap: state.currentSwap,
        swapHistory: state.swapHistory,
        isLoadingQuote: state.isLoadingQuote,
        isExecuting: state.isExecuting,
        isLoadingHistory: state.isLoadingHistory,
        error: state.error,
        pagination: state.pagination,

        // Actions
        getQuote,
        executeSwap,
        getSwapStatus,
        getHistory,
        clearQuote,
        clearCurrentSwap,
        clearError,
    };
}

export type { SwapQuote, SwapTransaction, TokenInfo, RouteStep };
