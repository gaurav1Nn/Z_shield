/**
 * ZShield Price Service
 * Token price aggregation
 */

import { coingeckoProvider } from '@/lib/providers/coingecko.provider';
import { logger } from '@/lib/utils/logger';

const log = logger.child('PriceService');

// Simple in-memory cache
let priceCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 60 * 1000; // 1 minute

export const priceService = {
    /**
     * Get all token prices
     */
    async getAllPrices() {
        // Check cache
        if (priceCache && Date.now() - priceCache.timestamp < CACHE_TTL) {
            return priceCache.data;
        }

        log.debug('Refreshing prices...');

        const rawPrices = await coingeckoProvider.getPrices();

        // Transform to our format
        const prices = {
            'ZEC': { ...rawPrices.zcash, btc: 0.0005, eth: 0.01, zec: 1 },
            'BTC': { ...rawPrices.bitcoin, btc: 1, eth: 18.5, zec: 1850 },
            'ETH': { ...rawPrices.ethereum, btc: 0.05, eth: 1, zec: 100 },
            'USDC': { ...rawPrices['usd-coin'], btc: 0.000015, eth: 0.0003, zec: 0.03 }
        };

        const result = {
            prices,
            lastUpdated: new Date().toISOString()
        };

        // Update cache
        priceCache = {
            data: result,
            timestamp: Date.now()
        };

        return result;
    },

    /**
     * Get single token price
     */
    async getTokenPrice(symbol: string) {
        const allPrices = await this.getAllPrices();
        return allPrices.prices[symbol.toUpperCase()];
    }
};
