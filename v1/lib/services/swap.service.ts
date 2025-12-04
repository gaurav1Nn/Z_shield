/**
 * ZShield Swap Service
 * Swap business logic
 */

import { sideshiftProvider } from '@/lib/providers/sideshift.provider';
import { swapRepository } from '@/lib/repositories/swap.repository';
import { quoteStore } from '@/lib/data/mock-db';
import { QuoteExpiredError, ValidationError } from '@/lib/errors';
import { logger } from '@/lib/utils/logger';
import { SwapQuote } from '@/lib/types/swap.types';

const log = logger.child('SwapService');

export const swapService = {
    /**
     * Get swap quote
     */
    async getQuote(fromToken: string, toToken: string, amount: string): Promise<SwapQuote> {
        log.info(`Getting quote: ${amount} ${fromToken} -> ${toToken}`);

        // Get raw quote from provider
        const providerQuote = await sideshiftProvider.getQuote(fromToken, toToken, amount);

        // Construct full quote object
        const quote: SwapQuote = {
            quoteId: providerQuote.id,
            fromToken: {
                symbol: fromToken,
                name: fromToken === 'ZEC' ? 'Zcash' : fromToken,
                icon: `/icons/${fromToken.toLowerCase()}.svg`,
                decimals: 8,
                color: '#fbbf24'
            },
            toToken: {
                symbol: toToken,
                name: toToken === 'ZEC' ? 'Zcash' : toToken,
                icon: `/icons/${toToken.toLowerCase()}.svg`,
                decimals: 8,
                color: '#6366f1'
            },
            fromAmount: amount,
            toAmount: providerQuote.settleAmount,
            rate: providerQuote.rate,
            rateInverse: (1 / parseFloat(providerQuote.rate)).toFixed(8),
            priceImpact: '0.05',
            fee: providerQuote.networkFee,
            feeUSD: '0.15',
            feePercent: '0.5',
            route: [
                { step: 1, from: fromToken, to: 'Pool', via: 'Shielded Pool', portion: '100%' },
                { step: 2, from: 'Pool', to: toToken, via: 'SideShift', portion: '100%' }
            ],
            estimatedTime: '5-10 min',
            expiresAt: providerQuote.expiresAt,
            privacyLevel: 'shielded',
            warnings: []
        };

        // Store quote
        quoteStore.set(quote.quoteId, quote);

        return quote;
    },

    /**
     * Execute swap
     */
    async executeSwap(sessionId: string, quoteId: string, fromAddress: string, toAddress: string) {
        log.info(`Executing swap for quote ${quoteId}`);

        // Retrieve and validate quote
        const quote = quoteStore.get(quoteId) as SwapQuote;
        if (!quote) {
            throw new QuoteExpiredError();
        }

        // Create order with provider
        const order = await sideshiftProvider.createOrder(quoteId, fromAddress, toAddress);

        // Create swap record
        const swap = await swapRepository.create({
            sessionId,
            fromToken: quote.fromToken.symbol,
            toToken: quote.toToken.symbol,
            fromAmount: quote.fromAmount,
            toAmount: quote.toAmount,
            rate: quote.rate,
            fee: quote.fee,
            depositAddress: order.depositAddress,
            destinationAddress: toAddress,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
        });

        return swap;
    },

    /**
     * Get swap status
     */
    async getSwapStatus(swapId: string) {
        return swapRepository.findById(swapId);
    },

    /**
     * Get user swap history
     */
    async getUserHistory(sessionId: string, limit: number = 10, offset: number = 0) {
        const allSwaps = await swapRepository.findBySession(sessionId);

        return {
            swaps: allSwaps.slice(offset, offset + limit),
            pagination: {
                total: allSwaps.length,
                limit,
                offset,
                hasMore: offset + limit < allSwaps.length
            }
        };
    }
};
