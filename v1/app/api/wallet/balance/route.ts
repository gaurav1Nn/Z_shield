import { NextRequest } from 'next/server';
import { walletService } from '@/lib/services/wallet.service';
import { withAuth } from '@/lib/middleware/auth.middleware';
import { apiSuccess } from '@/lib/utils/response';

async function handler(req: NextRequest, session: any) {
    // Get address from query param or default to session address
    const searchParams = req.nextUrl.searchParams;
    const address = searchParams.get('address') || session.address;

    const balances = await walletService.getBalances(address);

    return apiSuccess(balances);
}

export const GET = withAuth(handler);
