/**
 * ZShield Configuration
 * Environment configuration loader with typed values
 */

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

interface Config {
    // Database
    databaseUrl: string;

    // Security
    jwtSecret: string;

    // App Mode
    isDemoMode: boolean;
    isProduction: boolean;

    // API
    apiUrl: string;
    coingeckoApiUrl: string;

    // Session
    sessionExpiryHours: number;

    // Rate Limiting
    rateLimit: RateLimitConfig;

    // Swap Settings
    swap: {
        protocolFeePercent: number;
        quoteExpiryMinutes: number;
        orderExpiryHours: number;
    };

    // Supported Tokens
    supportedTokens: string[];
}

const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (!value && defaultValue === undefined) {
        console.warn(`⚠️ Missing environment variable: ${key}`);
        return '';
    }
    return value || defaultValue || '';
};

const getEnvBool = (key: string, defaultValue: boolean): boolean => {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
};

const getEnvNumber = (key: string, defaultValue: number): number => {
    const value = process.env[key];
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
};

export const config: Config = {
    // Database Configuration
    databaseUrl: getEnvVar('DATABASE_URL', 'file:./dev.db'),

    // Security Configuration
    jwtSecret: getEnvVar('JWT_SECRET', 'zshield-hackathon-secret-2024'),

    // Application Mode
    isDemoMode: getEnvBool('DEMO_MODE', true),
    isProduction: process.env.NODE_ENV === 'production',

    // API Configuration
    apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3000/api'),
    coingeckoApiUrl: getEnvVar('COINGECKO_API_URL', 'https://api.coingecko.com/api/v3'),

    // Session Configuration
    sessionExpiryHours: getEnvNumber('SESSION_EXPIRY_HOURS', 24),

    // Rate Limiting Configuration
    rateLimit: {
        maxRequests: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
        windowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 60000), // 1 minute
    },

    // Swap Configuration
    swap: {
        protocolFeePercent: 0.5,          // 0.5% protocol fee
        quoteExpiryMinutes: 15,           // Quotes valid for 15 minutes
        orderExpiryHours: 24,             // Swap orders expire after 24 hours
    },

    // Supported Trading Pairs
    supportedTokens: ['ZEC', 'ETH', 'BTC', 'USDC'],
};

// Validate critical configuration on startup
export const validateConfig = (): void => {
    const errors: string[] = [];

    if (!config.jwtSecret || config.jwtSecret.length < 16) {
        errors.push('JWT_SECRET must be at least 16 characters');
    }

    if (errors.length > 0) {
        console.error('❌ Configuration validation failed:');
        errors.forEach(err => console.error(`  - ${err}`));
        if (config.isProduction) {
            throw new Error('Invalid configuration in production mode');
        }
    } else {
        console.log('✅ Configuration validated successfully');
        if (config.isDemoMode) {
            console.log('🎭 Running in DEMO MODE - All blockchain interactions are simulated');
        }
    }
};

export default config;
