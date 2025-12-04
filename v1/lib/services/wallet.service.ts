/**
 * ZShield Wallet Service
 * Wallet operations business logic
 */

import { zcashProvider } from '@/lib/providers/zcash.provider';
import { priceService } from './price.service';
import { logger } from '@/lib/utils/logger';

const log = logger.child('WalletService');

export const walletService = {
    /**
     * Validate address
     */
    async validateAddress(address: string) {
        return zcashProvider.validateAddress(address);
    },

    /**
     * Get wallet balances with USD values
     */
    async getBalances(address: string) {
        log.debug(`Getting balances for ${address}`);

        // Get raw balances from provider
        const walletData = await zcashProvider.getBalance(address);

        // Get current prices
        const zecPrice = await priceService.getTokenPrice('ZEC');

        // Calculate USD values
        const balances = walletData.balances.map(balance => {
            const amount = parseFloat(balance.balance);
            const usdValue = amount * (zecPrice?.usd || 0);

            return {
                ...balance,
                balanceUSD: usdValue.toFixed(2)
            };
        });

        const totalValueUSD = balances.reduce((sum, b) => sum + parseFloat(b.balanceUSD), 0);

        return {
            ...walletData,
            balances,
            totalValueUSD: totalValueUSD.toFixed(2)
        };
    }
};
