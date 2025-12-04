"use client"

/**
 * ZShield Wallet Hook
 * Frontend hook for wallet connection and balance management
 */

import { useState, useEffect, useCallback } from 'react';

// Types
interface WalletInfo {
    address: string;
    shortAddress: string;
    type: 'sapling' | 'unified' | 'transparent' | 'orchard';
    isShielded: boolean;
    walletType: string;
    connectedAt: string;
}

interface TokenBalance {
    token: string;
    symbol: string;
    balance: string;
    balanceUSD: string;
    shielded: boolean;
    icon: string;
}

interface WalletState {
    isConnected: boolean;
    isConnecting: boolean;
    isValidating: boolean;
    wallet: WalletInfo | null;
    balances: TokenBalance[];
    totalValueUSD: string;
    error: string | null;
}

interface ValidationResult {
    isValid: boolean;
    type: string;
    isShielded: boolean;
    network: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
const SESSION_KEY = 'zshield_session';

/**
 * Get session token from localStorage
 */
const getStoredSession = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(SESSION_KEY);
};

/**
 * Store session token in localStorage
 */
const storeSession = (sessionId: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSION_KEY, sessionId);
};

/**
 * Clear session from localStorage
 */
const clearSession = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_KEY);
};

/**
 * Format address for display (first 8 + last 4)
 */
const formatAddress = (address: string): string => {
    if (address.length <= 16) return address;
    return `${address.substring(0, 8)}...${address.substring(address.length - 4)}`;
};

export function useWallet() {
    const [state, setState] = useState<WalletState>({
        isConnected: false,
        isConnecting: false,
        isValidating: false,
        wallet: null,
        balances: [],
        totalValueUSD: '0.00',
        error: null,
    });

    /**
     * Check for existing session on mount
     */
    useEffect(() => {
        const restoreSession = async () => {
            const sessionId = getStoredSession();
            if (!sessionId) return;

            try {
                const response = await fetch(`${API_BASE}/auth/session`, {
                    headers: {
                        'Authorization': `Bearer ${sessionId}`,
                    },
                });

                if (!response.ok) {
                    clearSession();
                    return;
                }

                const result = await response.json();

                if (result.success && result.data) {
                    const session = result.data;
                    setState(prev => ({
                        ...prev,
                        isConnected: true,
                        wallet: {
                            address: session.address,
                            shortAddress: formatAddress(session.address),
                            type: session.addressType,
                            isShielded: session.isShielded,
                            walletType: session.walletType,
                            connectedAt: session.connectedAt,
                        },
                    }));

                    // Fetch balances after restoring session
                    await refreshBalanceInternal(sessionId, session.address);
                }
            } catch (error) {
                console.error('Failed to restore session:', error);
                clearSession();
            }
        };

        restoreSession();
    }, []);

    /**
     * Internal balance refresh function
     */
    const refreshBalanceInternal = async (sessionId: string, address: string) => {
        try {
            const response = await fetch(`${API_BASE}/wallet/balance?address=${encodeURIComponent(address)}`, {
                headers: {
                    'Authorization': `Bearer ${sessionId}`,
                },
            });

            if (!response.ok) return;

            const result = await response.json();

            if (result.success && result.data) {
                setState(prev => ({
                    ...prev,
                    balances: result.data.balances,
                    totalValueUSD: result.data.totalValueUSD,
                }));
            }
        } catch (error) {
            console.error('Failed to fetch balance:', error);
        }
    };

    /**
     * Connect wallet with address and wallet type
     */
    const connect = useCallback(async (address: string, walletType: string): Promise<boolean> => {
        setState(prev => ({ ...prev, isConnecting: true, error: null }));

        try {
            const response = await fetch(`${API_BASE}/auth/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address, walletType }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || 'Connection failed');
            }

            const session = result.data;

            // Store session
            storeSession(session.sessionId);

            setState(prev => ({
                ...prev,
                isConnected: true,
                isConnecting: false,
                wallet: {
                    address: session.address,
                    shortAddress: formatAddress(session.address),
                    type: session.addressType,
                    isShielded: session.isShielded,
                    walletType: walletType,
                    connectedAt: session.connectedAt,
                },
            }));

            // Fetch initial balances
            await refreshBalanceInternal(session.sessionId, session.address);

            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to connect wallet';
            setState(prev => ({
                ...prev,
                isConnecting: false,
                error: message,
            }));
            return false;
        }
    }, []);

    /**
     * Disconnect wallet
     */
    const disconnect = useCallback(async (): Promise<void> => {
        const sessionId = getStoredSession();

        if (sessionId) {
            try {
                await fetch(`${API_BASE}/auth/disconnect`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${sessionId}`,
                    },
                });
            } catch (error) {
                console.error('Disconnect error:', error);
            }
        }

        clearSession();
        setState({
            isConnected: false,
            isConnecting: false,
            isValidating: false,
            wallet: null,
            balances: [],
            totalValueUSD: '0.00',
            error: null,
        });
    }, []);

    /**
     * Validate a Zcash address
     */
    const validateAddress = useCallback(async (address: string): Promise<ValidationResult | null> => {
        setState(prev => ({ ...prev, isValidating: true, error: null }));

        try {
            const response = await fetch(`${API_BASE}/wallet/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address }),
            });

            const result = await response.json();

            setState(prev => ({ ...prev, isValidating: false }));

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || 'Validation failed');
            }

            return {
                isValid: result.data.isValid,
                type: result.data.type,
                isShielded: result.data.isShielded,
                network: result.data.network,
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Validation failed';
            setState(prev => ({
                ...prev,
                isValidating: false,
                error: message,
            }));
            return null;
        }
    }, []);

    /**
     * Refresh wallet balances
     */
    const refreshBalance = useCallback(async (): Promise<void> => {
        const sessionId = getStoredSession();
        if (!sessionId || !state.wallet) return;

        await refreshBalanceInternal(sessionId, state.wallet.address);
    }, [state.wallet]);

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    /**
     * Get session token for API calls
     */
    const getSessionToken = useCallback((): string | null => {
        return getStoredSession();
    }, []);

    return {
        // State
        isConnected: state.isConnected,
        isConnecting: state.isConnecting,
        isValidating: state.isValidating,
        wallet: state.wallet,
        balances: state.balances,
        totalValueUSD: state.totalValueUSD,
        error: state.error,

        // Actions
        connect,
        disconnect,
        validateAddress,
        refreshBalance,
        clearError,
        getSessionToken,
    };
}

export type { WalletInfo, TokenBalance, ValidationResult };
