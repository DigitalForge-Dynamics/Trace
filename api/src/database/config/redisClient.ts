import { createClient } from "redis";

const password = process.env.API_REDIS_PASSWORD;
const host = process.env.API_REDIS_HOST;

if (password === undefined || host === undefined) {
  console.error(`Unable to load Redis credentials`);
}

const connectionUrl: string = `redis://:${password}@${host}:6379`;

export const redisClient = createClient({
  url: connectionUrl,
}).on("error", (err) => console.error(`Redis Client Error`, err));
