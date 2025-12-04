/**
 * ZShield CoinGecko Provider
 * Simulated price data provider
 */

import { logger } from '@/lib/utils/logger';

const log = logger.child('CoinGeckoProvider');

export const coingeckoProvider = {
    /**
     * Get current token prices
     */
    async getPrices(currency: string = 'usd') {
        log.debug('Fetching market prices...');

        // Mock market data
        return {
            'zcash': { usd: 35.50, change_24h: 2.5 },
            'bitcoin': { usd: 65230.00, change_24h: -1.2 },
            'ethereum': { usd: 3450.00, change_24h: 0.8 },
            'usd-coin': { usd: 1.00, change_24h: 0.01 }
        };
    },

    /**
     * Get single token price
     */
    async getTokenPrice(tokenId: string) {
        const prices = await this.getPrices();
        return prices[tokenId as keyof typeof prices];
    }
};
