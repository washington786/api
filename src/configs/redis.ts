import * as IORedis from "ioredis";

const Redis = IORedis.default as unknown as new (...args: any[]) => any;

const redisUrl = `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}:${process.env.REDIS_PORT}`;

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