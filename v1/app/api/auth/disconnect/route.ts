import { NextRequest } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { apiSuccess, withErrorHandling } from '@/lib/utils/response';

async function handler(req: NextRequest, session: any) {
    await authService.disconnect(session.sessionId);
    return apiSuccess({ disconnected: true });
}

export const POST = withAuth(handler);
