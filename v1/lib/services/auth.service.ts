/**
 * ZShield Auth Service
 * Authentication business logic
 */

import { sessionRepository } from '@/lib/repositories/session.repository';
import { zcashProvider } from '@/lib/providers/zcash.provider';
import { AuthenticationError, ValidationError } from '@/lib/errors';
import { logger } from '@/lib/utils/logger';

const log = logger.child('AuthService');

export const authService = {
    /**
     * Connect wallet and create session
     */
    async connectWallet(address: string, walletType: string) {
        log.info(`Connecting wallet: ${address}`);

        // Validate address
        const validation = await zcashProvider.validateAddress(address);
        if (!validation.isValid) {
            throw new ValidationError('Invalid Zcash address');
        }

        // Create session
        const session = await sessionRepository.create({
            address,
            addressType: validation.type as any,
            isShielded: validation.isShielded,
            walletType
        });

        return session;
    },

    /**
     * Disconnect wallet (end session)
     */
    async disconnect(sessionId: string) {
        return sessionRepository.delete(sessionId);
    },

    /**
     * Verify session validity
     */
    async verifySession(sessionId: string) {
        const session = await sessionRepository.findById(sessionId);
        if (!session) {
            throw new AuthenticationError('Session expired or invalid');
        }
        return session;
    }
};
