import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { getRedisClient } from "../database/config/redisClient";
import Logger from "../utils/Logger";

const rateLimiter = new RateLimiterRedis({
    storeClient: getRedisClient(),
    keyPrefix: 'middleware',
    points: 10,
    duration: 1,
    useRedisPackage: true
});

const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    rateLimiter
    .consume(req.ip ?? 'Unknown')
    .then(() => { next(); })
    .catch((reason: string) => {
        Logger.info(`RateLimitReason: ${reason}`);
        res.status(429).send('Too Many Requests');
    });
};

export { rateLimiterMiddleware };
