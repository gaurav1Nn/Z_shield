import { NextRequest } from 'next/server';
import { walletService } from '@/lib/services/wallet.service';
import { apiSuccess, withErrorHandling } from '@/lib/utils/response';
import { z } from 'zod';

const validateSchema = z.object({
    address: z.string().min(1, 'Address is required'),
});

export async function POST(req: NextRequest) {
    return withErrorHandling(async () => {
        const body = await req.json();

        const { address } = validateSchema.parse(body);

        const result = await walletService.validateAddress(address);

        return apiSuccess(result);
    });
}
