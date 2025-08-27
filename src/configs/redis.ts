import * as IORedis from "ioredis";

const Redis = IORedis.default;

const redisUrl = `redis://${process.env.REDIS_USERNAME || 'default'}:${process.env.REDIS_PASSWORD || 'rwMBSb6OADaB4zM5MmUfMXj9mS0BRqHy'}@${process.env.REDIS_URL || 'redis-16879.c341.af-south-1-1.ec2.redns.redis-cloud.com'}:${process.env.REDIS_PORT || '16879'}`;

export const redisClient = new Redis(redisUrl, {
    enableReadyCheck: false,
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redisClient.on("connect", () => {
    console.log("Redis connected:", redisUrl);
});

redisClient.on("error", (err: any) => {
    console.error("Redis connection error:", err);
});

export const connectRedis = async (): Promise<void> => {
    await redisClient.ping();
    console.log("Redis ping successful");
};