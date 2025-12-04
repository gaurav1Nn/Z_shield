/**
 * ZShield Logger Utility
 * Structured console logging for development
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    data?: unknown;
}

const LOG_COLORS = {
    debug: '\x1b[36m', // Cyan
    info: '\x1b[32m',  // Green
    warn: '\x1b[33m',  // Yellow
    error: '\x1b[31m', // Red
    reset: '\x1b[0m',
};

const LOG_EMOJI = {
    debug: '🔍',
    info: '✅',
    warn: '⚠️',
    error: '❌',
};

class Logger {
    private minLevel: LogLevel = 'debug';

    private readonly levelPriority: Record<LogLevel, number> = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
    };

    setMinLevel(level: LogLevel): void {
        this.minLevel = level;
    }

    private shouldLog(level: LogLevel): boolean {
        return this.levelPriority[level] >= this.levelPriority[this.minLevel];
    }

    private formatMessage(level: LogLevel, message: string, data?: unknown): string {
        const timestamp = new Date().toISOString();
        const emoji = LOG_EMOJI[level];
        const color = LOG_COLORS[level];
        const reset = LOG_COLORS.reset;

        let formattedMessage = `${color}[${timestamp}] ${emoji} ${level.toUpperCase()}: ${message}${reset}`;

        if (data !== undefined) {
            if (typeof data === 'object') {
                formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
            } else {
                formattedMessage += ` | ${data}`;
            }
        }

        return formattedMessage;
    }

    debug(message: string, data?: unknown): void {
        if (this.shouldLog('debug')) {
            console.log(this.formatMessage('debug', message, data));
        }
    }

    info(message: string, data?: unknown): void {
        if (this.shouldLog('info')) {
            console.log(this.formatMessage('info', message, data));
        }
    }

    warn(message: string, data?: unknown): void {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message, data));
        }
    }

    error(message: string, error?: unknown): void {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', message));

            if (error instanceof Error) {
                console.error(`  Stack: ${error.stack}`);
            } else if (error !== undefined) {
                console.error(`  Details:`, error);
            }
        }
    }

    /**
     * Log API request
     */
    request(method: string, path: string, statusCode: number, durationMs: number): void {
        const emoji = statusCode >= 400 ? '❌' : '✅';
        const color = statusCode >= 400 ? LOG_COLORS.error : LOG_COLORS.info;

        console.log(
            `${color}[${new Date().toISOString()}] ${emoji} ${method} ${path} - ${statusCode} (${durationMs}ms)${LOG_COLORS.reset}`
        );
    }

    /**
     * Create a child logger with prefix
     */
    child(prefix: string) {
        const parent = this;
        return {
            debug: (message: string, data?: unknown) => parent.debug(`[${prefix}] ${message}`, data),
            info: (message: string, data?: unknown) => parent.info(`[${prefix}] ${message}`, data),
            warn: (message: string, data?: unknown) => parent.warn(`[${prefix}] ${message}`, data),
            error: (message: string, error?: unknown) => parent.error(`[${prefix}] ${message}`, error),
        };
    }
}

export const logger = new Logger();

// Set log level based on environment
if (process.env.NODE_ENV === 'production') {
    logger.setMinLevel('info');
}
