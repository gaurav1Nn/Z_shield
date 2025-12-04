/**
 * ZShield Analytics Service
 * Platform statistics
 */

import { swapStore, sessionStore } from '@/lib/data/mock-db';

export const analyticsService = {
    /**
     * Get platform statistics
     */
    async getPlatformStats() {
        const totalSwaps = swapStore.count();
        const activeUsers = sessionStore.count();

        // Mock accumulated stats + real current stats
        return {
            totalVolumeUSD: '2,450,000',
            totalSwaps: 150000 + totalSwaps,
            privateSwaps: 142000 + Math.floor(totalSwaps * 0.9),
            activeUsers24h: 1250 + activeUsers,
            averageSwapTime: '45s',
            successRate: '99.8%',
            tvl: '12,500,000',
            supportedPairs: 45
        };
    }
};
