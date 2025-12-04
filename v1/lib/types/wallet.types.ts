/**
 * ZShield Wallet Type Definitions
 */

// Zcash address types
export type ZcashAddressType = 'sapling' | 'unified' | 'transparent' | 'orchard';

export interface AddressValidation {
    address: string;
    isValid: boolean;
    type: ZcashAddressType;
    isShielded: boolean;
    network: 'mainnet' | 'testnet';
}

// Wallet balance
export interface WalletBalance {
    address: string;
    balances: TokenBalance[];
    totalValueUSD: string;
    lastUpdated: string;
}

export interface TokenBalance {
    token: string;
    symbol: string;
    balance: string;
    balanceUSD: string;
    shielded: boolean;
    icon: string;
}

// Wallet request types
export interface ValidateAddressRequest {
    address: string;
}

export interface ValidateAddressResponse extends AddressValidation { }

export interface GetBalanceResponse extends WalletBalance { }
