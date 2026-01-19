import { Database } from "bun:sqlite";
import { describe, expect, it } from "bun:test";
import type { SocketAddress } from "bun";
import { RateLimiter } from "./rate-limit.ts";

describe("Unit > RateLimiter", () => {
  const address1: SocketAddress = {
    address: "127.0.0.1",
    family: "IPv4",
    port: 1,
  };
  const address2: SocketAddress = {
    address: "192.168.0.1",
    family: "IPv4",
    port: 2,
  };

  it("Does not rate limit a new request", async () => {
    const store = new Database(":memory:");
    const limiter = new RateLimiter(store);
    await limiter.init();
    let limited = false;
    {
      const count = await limiter.getCount(address1);
      if (count > 5) limited = true;
      await limiter.increment(address1);
    }
    expect(limited).toBeFalse();
  });

  it("Does rate limit excessive requests", async () => {
    const store = new Database(":memory:");
    const limiter = new RateLimiter(store);
    await limiter.init();
    let limited = false;
    for (let i = 0; i < 10; i++) {
      const count = await limiter.getCount(address1);
      if (count > 5) limited = true;
      await limiter.increment(address1);
    }
    expect(limited).toBeTrue();
  });

  it("Applies separate tracking for rate per address", async () => {
    const store = new Database(":memory:");
    const limiter = new RateLimiter(store);
    await limiter.init();
    let limited = false;
    for (let i = 0; i < 10; i++) {
      const count = await limiter.getCount(address1);
      if (count > 5) limited = true;
      await limiter.increment(address1);
    }
    expect(limited).toBeTrue();
    await limiter.increment(address2);
    expect(limiter.getCount(address2)).resolves.toStrictEqual(1);
  });
});
