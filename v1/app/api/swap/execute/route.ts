import { NextRequest } from 'next/server';
import { swapService } from '@/lib/services/swap.service';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { apiSuccess } from '@/lib/utils/response';
import { z } from 'zod';

const executeSchema = z.object({
    quoteId: z.string().min(1),
    fromAddress: z.string().min(1),
    toAddress: z.string().min(1),
    fromToken: z.string(),
    toToken: z.string(),
    fromAmount: z.string()
});

async function handler(req: NextRequest, session: any) {
    const body = await req.json();

    const { quoteId, fromAddress, toAddress } = executeSchema.parse(body);

    const swap = await swapService.executeSwap(
        session.sessionId,
        quoteId,
        fromAddress,
        toAddress
    );

    return apiSuccess(swap);
}

export const POST = withAuth(handler);
