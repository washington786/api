import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

let client: RedisClientType;

// Environment variables (ensure they're set)
const REDIS_URL = process.env.REDIS_URL;
const REDIS_PORT = process.env.REDIS_PORT || '16879';
const REDIS_USERNAME = process.env.REDIS_USERNAME;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

export async function connectRedis() {
    if (!REDIS_URL || !REDIS_USERNAME || !REDIS_PASSWORD) {
        console.error('Missing Redis credentials in .env');
        process.exit(1);
    }

    try {
        client = createClient({
            username: REDIS_USERNAME,
            password: REDIS_PASSWORD,
            socket: {
                host: REDIS_URL,
                port: parseInt(REDIS_PORT),
                tls: true,
            },
        });

        // Handle connection errors
        client.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });

        // Log connection success
        client.on('connect', () => {
            console.log('Redis client connecting...');
        });

        client.on('ready', () => {
            console.log('Redis client connected and ready');
        });

        // Connect to Redis
        await client.connect();

        // Optional: Test connection
        await client.set('ping', 'pong');
        const response = await client.get('ping');
        console.log(`Redis test: ${response}`); // Should log: pong
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
        process.exit(1);
    }
}

export { client as redisClient };