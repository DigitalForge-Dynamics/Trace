import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../database/config/redisClient";

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware',
    points: 10,
    duration: 1,
    useRedisPackage: true
});

const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    rateLimiter.consume(req.ip ?? 'Unknown').then(() => {
        next();
    }).catch(() => {
        res.status(429).send('Too Many Requests');
    });
};

export { rateLimiterMiddleware };