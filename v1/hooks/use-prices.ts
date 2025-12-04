"use client"

/**
 * ZShield Prices Hook
 * Frontend hook for token price data with auto-refresh
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Types
interface PriceData {
    usd: number;
    btc: number;
    eth: number;
    zec: number;
    change24h: number;
}

interface PricesState {
    prices: Record<string, PriceData>;
    isLoading: boolean;
    lastUpdated: Date | null;
    error: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
const REFRESH_INTERVAL = 30000; // 30 seconds

export function usePrices(autoRefresh: boolean = true) {
    const [state, setState] = useState<PricesState>({
        prices: {},
        isLoading: true,
        lastUpdated: null,
        error: null,
    });

    const refreshInterval = useRef<NodeJS.Timeout | null>(null);

    /**
     * Fetch all token prices
     */
    const fetchPrices = useCallback(async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE}/price`);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || 'Failed to fetch prices');
            }

            setState(prev => ({
                ...prev,
                prices: result.data.prices,
                lastUpdated: new Date(result.data.lastUpdated),
                isLoading: false,
                error: null,
            }));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch prices';
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: message,
            }));
        }
    }, []);

    /**
     * Get price for specific token
     */
    const getTokenPrice = useCallback((symbol: string): PriceData | null => {
        const upperSymbol = symbol.toUpperCase();
        return state.prices[upperSymbol] || null;
    }, [state.prices]);

    /**
     * Get formatted USD price string
     */
    const getFormattedPrice = useCallback((symbol: string, decimals: number = 2): string => {
        const price = getTokenPrice(symbol);
        if (!price) return '$0.00';

        const usdPrice = price.usd;
        if (usdPrice >= 1000) {
            return `$${usdPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
        }
        return `$${usdPrice.toFixed(decimals)}`;
    }, [getTokenPrice]);

    /**
     * Get price change color class
     */
    const getPriceChangeColor = useCallback((symbol: string): string => {
        const price = getTokenPrice(symbol);
        if (!price) return 'text-muted-foreground';

        if (price.change24h > 0) return 'text-emerald-400';
        if (price.change24h < 0) return 'text-red-400';
        return 'text-muted-foreground';
    }, [getTokenPrice]);

    /**
     * Get formatted change string
     */
    const getFormattedChange = useCallback((symbol: string): string => {
        const price = getTokenPrice(symbol);
        if (!price) return '0.00%';

        const sign = price.change24h >= 0 ? '+' : '';
        return `${sign}${price.change24h.toFixed(2)}%`;
    }, [getTokenPrice]);

    /**
     * Calculate value in USD
     */
    const calculateUSD = useCallback((symbol: string, amount: string | number): string => {
        const price = getTokenPrice(symbol);
        if (!price) return '0.00';

        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) return '0.00';

        const value = numAmount * price.usd;
        return value.toFixed(2);
    }, [getTokenPrice]);

    /**
     * Convert between tokens
     */
    const convertAmount = useCallback((
        fromSymbol: string,
        toSymbol: string,
        amount: string | number
    ): string => {
        const fromPrice = getTokenPrice(fromSymbol);
        const toPrice = getTokenPrice(toSymbol);

        if (!fromPrice || !toPrice) return '0';

        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) return '0';

        const usdValue = numAmount * fromPrice.usd;
        const result = usdValue / toPrice.usd;

        // Format based on value size
        if (result >= 1000) {
            return result.toFixed(2);
        } else if (result >= 1) {
            return result.toFixed(4);
        } else {
            return result.toFixed(8);
        }
    }, [getTokenPrice]);

    /**
     * Initial fetch and setup auto-refresh
     */
    useEffect(() => {
        // Initial fetch
        fetchPrices();

        // Setup auto-refresh if enabled
        if (autoRefresh) {
            refreshInterval.current = setInterval(fetchPrices, REFRESH_INTERVAL);
        }

        // Cleanup
        return () => {
            if (refreshInterval.current) {
                clearInterval(refreshInterval.current);
                refreshInterval.current = null;
            }
        };
    }, [fetchPrices, autoRefresh]);

    /**
     * Manual refresh
     */
    const refresh = useCallback(async (): Promise<void> => {
        setState(prev => ({ ...prev, isLoading: true }));
        await fetchPrices();
    }, [fetchPrices]);

    /**
     * Clear error
     */
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    return {
        // State
        prices: state.prices,
        isLoading: state.isLoading,
        lastUpdated: state.lastUpdated,
        error: state.error,

        // Getters
        getTokenPrice,
        getFormattedPrice,
        getPriceChangeColor,
        getFormattedChange,
        calculateUSD,
        convertAmount,

        // Actions
        refresh,
        clearError,
    };
}

export type { PriceData };
