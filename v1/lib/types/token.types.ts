/**
 * ZShield Token Type Definitions
 */

// Token information
export interface TokenInfo {
    symbol: string;
    name: string;
    icon: string;
    decimals: number;
    color: string;
    isShielded?: boolean;
}

// Price data
export interface PriceData {
    usd: number;
    btc: number;
    eth: number;
    zec: number;
    change24h: number;
}

// All prices response
export interface TokenPrices {
    prices: Record<string, PriceData>;
    lastUpdated: string;
}

// Detailed token price
export interface TokenPriceDetails {
    symbol: string;
    name: string;
    price: PriceData;
    marketCap?: number;
    volume24h?: number;
    high24h?: number;
    low24h?: number;
    lastUpdated: string;
}

// Platform statistics
export interface PlatformStats {
    totalVolumeUSD: string;
    totalSwaps: number;
    privateSwaps: number;
    activeUsers24h: number;
    averageSwapTime: string;
    successRate: string;
    tvl: string;
    supportedPairs: number;
}
