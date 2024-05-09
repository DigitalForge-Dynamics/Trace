import { RedisClientType, createClient } from "redis";
import ErrorController from "../../controllers/ErrorController";
import Logger from "../../utils/Logger";
import { getCacheHost, getCachePassword } from "../../utils/Environment";

let connectionUrl: string | undefined;
let redisClient: RedisClientType | undefined;

const getConnectionUrl = (): string => {
  if (connectionUrl !== undefined) return connectionUrl;
  const password = getCachePassword();
  const host = getCacheHost();
  if (host === undefined || password === undefined) {
    Logger.error("Missing Redis Credentials");
    throw ErrorController.InternalServerError();
  }
  connectionUrl = `redis://:${password}@${host}:6379`;
  return connectionUrl;
};

export const getRedisClient = (): RedisClientType => {
  if (redisClient !== undefined) return redisClient;
  redisClient = createClient({ url: getConnectionUrl() });
  redisClient.on("error", (err) => Logger.error(`Redis Client Error: ${err}`));
  redisClient.on("connect", () => Logger.info("Redis connected"));
  return redisClient;
};
