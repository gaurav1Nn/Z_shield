/**
 * ZShield Mock Database
 * In-memory data storage for demo purposes
 */

import { Session } from '@/lib/types/api.types';
import { SwapTransaction } from '@/lib/types/swap.types';
import { logger } from '@/lib/utils/logger';

// In-memory stores (would be Redis/Prisma in production)
const sessions = new Map<string, Session>();
const swaps = new Map<string, SwapTransaction>();
const quotes = new Map<string, { data: unknown; expiresAt: Date }>();

// Transaction logs
const transactions = new Map<string, {
    txHash: string;
    type: 'deposit' | 'settlement';
    swapId: string;
    timestamp: string;
}>();

/**
 * Session Store
 */
export const sessionStore = {
    set(sessionId: string, session: Session): void {
        sessions.set(sessionId, session);
        logger.debug(`Session created: ${sessionId.substring(0, 8)}...`);
    },

    get(sessionId: string): Session | undefined {
        return sessions.get(sessionId);
    },

    delete(sessionId: string): boolean {
        const existed = sessions.has(sessionId);
        sessions.delete(sessionId);
        if (existed) {
            logger.debug(`Session deleted: ${sessionId.substring(0, 8)}...`);
        }
        return existed;
    },

    findByAddress(address: string): Session | undefined {
        for (const session of sessions.values()) {
            if (session.address === address) {
                return session;
            }
        }
        return undefined;
    },

    getAll(): Session[] {
        return Array.from(sessions.values());
    },

    cleanup(): number {
        const now = new Date();
        let cleaned = 0;

        for (const [id, session] of sessions.entries()) {
            if (new Date(session.expiresAt) < now) {
                sessions.delete(id);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            logger.info(`Cleaned up ${cleaned} expired sessions`);
        }
        return cleaned;
    },

    count(): number {
        return sessions.size;
    },
};

/**
 * Swap Store
 */
export const swapStore = {
    set(swapId: string, swap: SwapTransaction): void {
        swaps.set(swapId, swap);
        logger.debug(`Swap created: ${swapId.substring(0, 8)}...`);
    },

    get(swapId: string): SwapTransaction | undefined {
        return swaps.get(swapId);
    },

    update(swapId: string, updates: Partial<SwapTransaction>): SwapTransaction | undefined {
        const existing = swaps.get(swapId);
        if (!existing) return undefined;

        const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
        swaps.set(swapId, updated);
        logger.debug(`Swap updated: ${swapId.substring(0, 8)}... -> ${updates.status || 'no status change'}`);
        return updated;
    },

    findBySession(sessionId: string): SwapTransaction[] {
        const result: SwapTransaction[] = [];
        for (const swap of swaps.values()) {
            if (swap.sessionId === sessionId) {
                result.push(swap);
            }
        }
        return result.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },

    getAll(): SwapTransaction[] {
        return Array.from(swaps.values());
    },

    count(): number {
        return swaps.size;
    },

    countByStatus(status: SwapTransaction['status']): number {
        let count = 0;
        for (const swap of swaps.values()) {
            if (swap.status === status) count++;
        }
        return count;
    },
};

/**
 * Quote Store (temporary, auto-expires)
 */
export const quoteStore = {
    set(quoteId: string, data: unknown, expiryMinutes: number = 15): void {
        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
        quotes.set(quoteId, { data, expiresAt });
        logger.debug(`Quote stored: ${quoteId.substring(0, 8)}... expires in ${expiryMinutes}m`);
    },

    get(quoteId: string): unknown | undefined {
        const quote = quotes.get(quoteId);
        if (!quote) return undefined;

        if (new Date() > quote.expiresAt) {
            quotes.delete(quoteId);
            logger.debug(`Quote expired: ${quoteId.substring(0, 8)}...`);
            return undefined;
        }

        return quote.data;
    },

    delete(quoteId: string): boolean {
        return quotes.delete(quoteId);
    },

    cleanup(): number {
        const now = new Date();
        let cleaned = 0;

        for (const [id, quote] of quotes.entries()) {
            if (now > quote.expiresAt) {
                quotes.delete(id);
                cleaned++;
            }
        }

        return cleaned;
    },
};

/**
 * Transaction Store
 */
export const transactionStore = {
    add(txHash: string, type: 'deposit' | 'settlement', swapId: string): void {
        transactions.set(txHash, {
            txHash,
            type,
            swapId,
            timestamp: new Date().toISOString(),
        });
    },

    findBySwap(swapId: string): Array<{ txHash: string; type: 'deposit' | 'settlement'; timestamp: string }> {
        const result: Array<{ txHash: string; type: 'deposit' | 'settlement'; timestamp: string }> = [];
        for (const tx of transactions.values()) {
            if (tx.swapId === swapId) {
                result.push({ txHash: tx.txHash, type: tx.type, timestamp: tx.timestamp });
            }
        }
        return result;
    },
};

/**
 * Database statistics
 */
export function getDbStats(): {
    sessions: number;
    swaps: number;
    quotes: number;
    transactions: number;
} {
    return {
        sessions: sessions.size,
        swaps: swaps.size,
        quotes: quotes.size,
        transactions: transactions.size,
    };
}

// Periodic cleanup (every 5 minutes)
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        sessionStore.cleanup();
        quoteStore.cleanup();
    }, 5 * 60 * 1000);
}

logger.info('Mock database initialized');
