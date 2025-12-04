/**
 * ZShield Swap Repository
 * Data access for swap transactions
 */

import { SwapTransaction, SwapStatus } from '@/lib/types/swap.types';
import { swapStore } from '@/lib/data/mock-db';
import { logger } from '@/lib/utils/logger';
import { v4 as uuidv4 } from 'uuid';

const log = logger.child('SwapRepository');

export const swapRepository = {
    /**
     * Create new swap
     */
    async create(data: Omit<SwapTransaction, 'swapId' | 'status' | 'statusMessage' | 'progress' | 'createdAt' | 'updatedAt'>): Promise<SwapTransaction> {
        const now = new Date().toISOString();

        const swap: SwapTransaction = {
            swapId: uuidv4(),
            ...data,
            status: 'pending_deposit',
            statusMessage: 'Waiting for deposit...',
            progress: 10,
            createdAt: now,
            updatedAt: now,
        };

        swapStore.set(swap.swapId, swap);
        log.info(`Created swap ${swap.swapId}`);

        // Start auto-progression simulation
        this.simulateProgression(swap.swapId);

        return swap;
    },

    /**
     * Find swap by ID
     */
    async findById(swapId: string): Promise<SwapTransaction | null> {
        const swap = swapStore.get(swapId);
        return swap || null;
    },

    /**
     * Find swaps by session
     */
    async findBySession(sessionId: string): Promise<SwapTransaction[]> {
        return swapStore.findBySession(sessionId);
    },

    /**
     * Update swap status
     */
    async updateStatus(swapId: string, status: SwapStatus, message: string, progress: number): Promise<SwapTransaction | null> {
        const updates = {
            status,
            statusMessage: message,
            progress,
            updatedAt: new Date().toISOString()
        };

        return swapStore.update(swapId, updates) || null;
    },

    /**
     * Simulate swap progression for demo
     */
    simulateProgression(swapId: string) {
        const steps = [
            { delay: 5000, status: 'confirming', message: 'Confirming deposit...', progress: 30 },
            { delay: 10000, status: 'exchanging', message: 'Exchanging assets...', progress: 60 },
            { delay: 15000, status: 'sending', message: 'Sending to destination...', progress: 80 },
            { delay: 20000, status: 'completed', message: 'Swap completed!', progress: 100 }
        ];

        steps.forEach(step => {
            setTimeout(async () => {
                const swap = await this.findById(swapId);
                if (swap && swap.status !== 'failed') {
                    await this.updateStatus(swapId, step.status as SwapStatus, step.message, step.progress);

                    if (step.status === 'completed') {
                        swapStore.update(swapId, { completedAt: new Date().toISOString() });
                    }
                }
            }, step.delay);
        });
    }
};
