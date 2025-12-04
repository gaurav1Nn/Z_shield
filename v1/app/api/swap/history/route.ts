import { NextRequest } from 'next/server';
import { swapService } from '@/lib/services/swap.service';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { apiSuccess } from '@/lib/utils/response';

async function handler(req: NextRequest, session: any) {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const history = await swapService.getUserHistory(session.sessionId, limit, offset);

    return apiSuccess(history);
}

export const GET = withAuth(handler);
