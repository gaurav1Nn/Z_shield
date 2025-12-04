import { NextRequest } from 'next/server';
import { priceService } from '@/lib/services/price.service';
import { apiSuccess, withErrorHandling } from '@/lib/utils/response';

export async function GET(req: NextRequest) {
    return withErrorHandling(async () => {
        const prices = await priceService.getAllPrices();
        return apiSuccess(prices);
    });
}
