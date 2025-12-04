/**
 * ZShield Session Repository
 * Data access layer for session management
 */

import { v4 as uuidv4 } from 'uuid';
import { Session } from '@/lib/types/api.types';
import { sessionStore } from '@/lib/data/mock-db';
import { config } from '@/config';
import { logger } from '@/lib/utils/logger';

const log = logger.child('SessionRepository');

export interface CreateSessionData {
    address: string;
    addressType: 'sapling' | 'unified' | 'transparent' | 'orchard';
    isShielded: boolean;
    walletType: string;
}

export const sessionRepository = {
    /**
     * Create a new session
     */
    async create(data: CreateSessionData): Promise<Session> {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + config.sessionExpiryHours * 60 * 60 * 1000);

        const session: Session = {
            sessionId: uuidv4(),
            address: data.address,
            addressType: data.addressType,
            isShielded: data.isShielded,
            walletType: data.walletType,
            connectedAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            lastActivityAt: now.toISOString(),
        };

        sessionStore.set(session.sessionId, session);
        log.info(`Created session for ${data.address.substring(0, 12)}...`);

        return session;
    },

    /**
     * Find session by ID
     */
    async findById(sessionId: string): Promise<Session | null> {
        const session = sessionStore.get(sessionId);

        if (!session) {
            return null;
        }

        // Check expiration
        if (new Date(session.expiresAt) < new Date()) {
            log.debug(`Session expired: ${sessionId.substring(0, 8)}...`);
            sessionStore.delete(sessionId);
            return null;
        }

        // Update last activity
        const updated = {
            ...session,
            lastActivityAt: new Date().toISOString(),
        };
        sessionStore.set(sessionId, updated);

        return updated;
    },

    /**
     * Find session by wallet address
     */
    async findByAddress(address: string): Promise<Session | null> {
        const session = sessionStore.findByAddress(address);

        if (!session) {
            return null;
        }

        // Check expiration
        if (new Date(session.expiresAt) < new Date()) {
            sessionStore.delete(session.sessionId);
            return null;
        }

        return session;
    },

    /**
     * Delete session
     */
    async delete(sessionId: string): Promise<boolean> {
        const existed = sessionStore.delete(sessionId);
        if (existed) {
            log.info(`Deleted session: ${sessionId.substring(0, 8)}...`);
        }
        return existed;
    },

    /**
     * Extend session expiry
     */
    async extend(sessionId: string, hours?: number): Promise<Session | null> {
        const session = sessionStore.get(sessionId);
        if (!session) return null;

        const extendHours = hours || config.sessionExpiryHours;
        const newExpiry = new Date(Date.now() + extendHours * 60 * 60 * 1000);

        const updated = {
            ...session,
            expiresAt: newExpiry.toISOString(),
            lastActivityAt: new Date().toISOString(),
        };

        sessionStore.set(sessionId, updated);
        log.debug(`Extended session: ${sessionId.substring(0, 8)}...`);

        return updated;
    },

    /**
     * Get all active sessions
     */
    async getActiveSessions(): Promise<Session[]> {
        const now = new Date();
        return sessionStore.getAll().filter(
            session => new Date(session.expiresAt) > now
        );
    },

    /**
     * Count active sessions
     */
    async countActive(): Promise<number> {
        const sessions = await this.getActiveSessions();
        return sessions.length;
    },

    /**
     * Cleanup expired sessions
     */
    async cleanup(): Promise<number> {
        return sessionStore.cleanup();
    },
};

export default sessionRepository;
