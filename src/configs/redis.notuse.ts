import Redis from 'ioredis';

const {
    REDIS_URL,
    REDIS_PORT = '16879',
    REDIS_USERNAME,
    REDIS_PASSWORD,
} = process.env;

if (!REDIS_URL || !REDIS_USERNAME || !REDIS_PASSWORD) {
    console.error('Missing Redis credentials in .env');
    process.exit(1);
}

export const redisClient = new (Redis as any)({
    host: process.env.REDIS_HOST,
    port: parseInt(`${process.env.REDIS_PORT}`),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    tls: true,

    retryStrategy: (times: any) => Math.min(times * 500, 2000),
    connectTimeout: 10000,
});

// Log events
redisClient.on('connect', () => {
    console.log(`Redis connected: ${REDIS_URL}`);
});

redisClient.on('ready', () => {
    console.log('Redis ping successful');
});

redisClient.on('error', (err: any) => {
    console.error('Redis connection error:', err.message);
});

redisClient.on('reconnecting', (delay: any) => {
    console.log(`Redis reconnecting... in ${delay}ms`);
});

export const connectRedis = async (): Promise<void> => {
    try {
        await redisClient.ping();
    } catch (err) {
        console.error('Failed to ping Redis');
        throw err;
    }
};