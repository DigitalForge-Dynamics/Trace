import { Database as SqLite } from "bun:sqlite";
import { RedisClient, type Server, type SocketAddress } from "bun";

const rateLimitRequest = async (
  req: Request,
  server: Server<undefined>,
  ratelimiter: RateLimiter,
): Promise<Response | null> => {
  const addr = server.requestIP(req);
  if (addr === null) return null; // Unix Domain Socket is not rate-limited.
  const count = await ratelimiter.getCount(addr);
  if (count > 5) {
    return Response.json({ message: "Rate Limited" }, { status: 429 });
  }
  await ratelimiter.increment(addr);
  return null;
};

class RateLimiter {
  private readonly storage: { type: "redis"; client: RedisClient } | { type: "sqlite"; client: SqLite };

  private readonly expiry: number;

  constructor(client: RedisClient | SqLite, expiry = 300) {
    this.expiry = expiry;
    if (client instanceof RedisClient) {
      this.storage = { type: "redis", client };
    } else if (client instanceof SqLite) {
      this.storage = { type: "sqlite", client };
    } else {
      client satisfies never;
      throw new Error();
    }
  }

  async init(): Promise<this> {
    if (this.storage.type === "redis") {
    } else if (this.storage.type === "sqlite") {
      await this.storage.client.run(
        "CREATE TABLE IF NOT EXISTS _trace_ratelimiter ( key STRING PRIMARY KEY NOT NULL, count INTEGER NOT NULL, last INTEGER NOT NULL );",
      );
    } else {
      this.storage satisfies never;
    }
    return this;
  }

  static getKey(address: SocketAddress): string {
    return address.address;
  }

  async getCount(address: SocketAddress): Promise<number> {
    const key = RateLimiter.getKey(address);
    if (this.storage.type === "redis") {
      const value = await this.storage.client.get(key);
      if (value === null) return 0;
      return Number.parseInt(value, 10);
    }
    if (this.storage.type === "sqlite") {
      // Prune old data. Then check for current count.
      await this.storage.client
        .query("DELETE FROM _trace_ratelimiter WHERE last < $expiry")
        .values({ $expiry: Math.floor(Date.now() / 1000) - this.expiry });
      const value = (await this.storage.client
        .query("SELECT count FROM _trace_ratelimiter WHERE key = $key")
        .get({ $key: key })) as null | { count: number };
      if (value === null) return 0;
      return value.count;
    }
    this.storage satisfies never;
    throw new Error();
  }

  async increment(address: SocketAddress): Promise<void> {
    const key = RateLimiter.getKey(address);
    if (this.storage.type === "redis") {
      const count = await this.storage.client.incr(key);
      if (count === 1) {
        await this.storage.client.expire(key, this.expiry);
      }
    } else if (this.storage.type === "sqlite") {
      const value = (await this.storage.client
        .query("SELECT count FROM _trace_ratelimiter WHERE key = $key")
        .get({ $key: key })) as null | { count: number };
      const next = value === null ? 1 : 1 + value.count;
      if (value === null) {
        const sql = `INSERT INTO _trace_ratelimiter (key, count, last) VALUES ("${key}", 1, ${Math.floor(Date.now() / 1000)})`;
        await this.storage.client.run(sql);
      } else {
        await this.storage.client
          .query("UPDATE _trace_ratelimiter SET count = $count, last = $timestamp WHERE key = $key")
          .run({ $count: next, $timestamp: Math.floor(Date.now() / 1000), $key: key });
      }
    } else {
      this.storage satisfies never;
      throw new Error();
    }
  }
}

export { rateLimitRequest, RateLimiter };
