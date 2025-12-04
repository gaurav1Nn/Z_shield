/**
 * ZShield Transaction Repository
 * Data access for blockchain transactions
 */

import { transactionStore } from '@/lib/data/mock-db';
import { logger } from '@/lib/utils/logger';

const log = logger.child('TransactionRepository');

export const transactionRepository = {
    /**
     * Log a transaction
     */
    async create(txHash: string, type: 'deposit' | 'settlement', swapId: string) {
        transactionStore.add(txHash, type, swapId);
        log.info(`Logged ${type} tx: ${txHash}`);
    },

    /**
     * Get transactions for a swap
     */
    async findBySwap(swapId: string) {
        return transactionStore.findBySwap(swapId);
    }
};
