import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { apiSuccess } from '@/lib/utils/response';

async function handler(req: NextRequest, session: any) {
    return apiSuccess(session);
}

export const GET = withAuth(handler);
