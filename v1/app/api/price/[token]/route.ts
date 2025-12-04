import { NextRequest } from 'next/server';
import { priceService } from '@/lib/services/price.service';
import { apiSuccess, apiError } from '@/lib/utils/response';
import { NotFoundError } from '@/lib/errors';

export async function GET(
    req: NextRequest,
    { params }: { params: { token: string } }
) {
    try {
        const token = params.token;

        if (!token) {
            throw new NotFoundError('Token');
        }

        const price = await priceService.getTokenPrice(token);

        if (!price) {
            throw new NotFoundError(`Token ${token}`);
        }

        return apiSuccess(price);
    } catch (error) {
        return apiError(error);
    }
}
