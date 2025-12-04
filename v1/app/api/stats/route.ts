import { NextRequest } from 'next/server';
import { analyticsService } from '@/lib/services/analytics.service';
import { apiSuccess, withErrorHandling } from '@/lib/utils/response';

export async function GET(req: NextRequest) {
    return withErrorHandling(async () => {
        const stats = await analyticsService.getPlatformStats();
        return apiSuccess(stats);
    });
}
