import { NextRequest } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { apiSuccess, withErrorHandling } from '@/lib/utils/response';
import { z } from 'zod';

const connectSchema = z.object({
    address: z.string().min(1, 'Address is required'),
    walletType: z.string().min(1, 'Wallet type is required'),
});

export async function POST(req: NextRequest) {
    return withErrorHandling(async () => {
        const body = await req.json();

        // Validate request
        const { address, walletType } = connectSchema.parse(body);

        // Connect wallet
        const session = await authService.connectWallet(address, walletType);

        return apiSuccess(session);
    });
}
