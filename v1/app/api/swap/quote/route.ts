import { NextRequest } from 'next/server';
import { swapService } from '@/lib/services/swap.service';
import { apiSuccess, withErrorHandling } from '@/lib/utils/response';
import { z } from 'zod';

const quoteSchema = z.object({
    fromToken: z.string().min(1),
    toToken: z.string().min(1),
    fromAmount: z.string().min(1),
    slippage: z.number().optional()
});

export async function POST(req: NextRequest) {
    return withErrorHandling(async () => {
        const body = await req.json();

        const { fromToken, toToken, fromAmount } = quoteSchema.parse(body);

        const quote = await swapService.getQuote(fromToken, toToken, fromAmount);

        return apiSuccess(quote);
    });
}
