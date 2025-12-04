import { NextRequest } from 'next/server';
import { swapService } from '@/lib/services/swap.service';
import { withOptionalAuth } from '@/lib/middleware/auth.middleware';
import { apiSuccess, apiError } from '@/lib/utils/response';
import { NotFoundError } from '@/lib/errors';

async function handler(req: NextRequest, session: any) {
    // Extract ID from URL path manually since Next.js 13+ App Router params are passed differently
    // But here we are in a route handler, so we need to get it from the URL
    const segments = req.nextUrl.pathname.split('/');
    const id = segments[segments.length - 1];

    if (!id) {
        throw new NotFoundError('Swap ID');
    }

    const swap = await swapService.getSwapStatus(id);

    if (!swap) {
        throw new NotFoundError('Swap');
    }

    return apiSuccess(swap);
}

export const GET = withOptionalAuth(handler);
