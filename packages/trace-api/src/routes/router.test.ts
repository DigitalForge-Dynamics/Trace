import { afterAll, beforeAll, describe, expect, it, spyOn } from "bun:test";
import { buildParams, compilePath, createRouter } from "./router.ts";

describe("Unit: Tests compilePath() Function", () => {
  it("Compiles a static path", () => {
    const compiled = compilePath("/hello");

    expect(compiled.paramNames).toBeArrayOfSize(0);
    expect(compiled.regex.test("/hello")).toBeTrue();
    expect(compiled.regex.test("/hello/")).toBeTrue();
    expect(compiled.regex.test("/hello/world")).toBeFalse();
  });

  it("Captures named params", () => {
    const compiled = compilePath("/users/:id");
    const match = compiled.regex.exec("/users/42");

    expect(compiled.paramNames).toStrictEqual(["id"]);
    expect(match).not.toBeNull();
    expect(match?.[1]).toBe("42");
  });

  it("Throws on missing leading slash", () => {
    expect(() => compilePath("users/:id")).toThrow();
  });
});

describe("Unit: Tests buildParams() Function", () => {
  it("Returns params object when match succeeds", () => {
    const compiled = compilePath("/a/:x/b/:y");
    const params = buildParams(compiled, "/a/one/b/two");

    expect(params).toStrictEqual({ x: "one", y: "two" });
  });

  it("Returns null when no match", () => {
    const compiled = compilePath("/a/:x/b/:y");

    expect(buildParams(compiled, "/a/one/b")).toBeNull();
  });

  it("Supports trailing slash", () => {
    const compiled = compilePath("/a/:x");
    const params = buildParams(compiled, "/a/six/");

    expect(params).toStrictEqual({ x: "six" });
  });
});

describe("Unit: Tests createRouter() Function", () => {
  const makeRequest = (path: string, init?: RequestInit): Request => new Request(`https://localhost${path}`, init);

  it("Dispatched to matching GET route", async () => {
    const router = createRouter();
    router.get("/hello-world", () => Response.json({ data: "Hello World" }));
    const response = await router.fetch(makeRequest("/hello-world"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toStrictEqual({ data: "Hello World" });
  });

  it("Injects params into handler context", async () => {
    const router = createRouter();
    router.get("/users/:id", ({ params }) => Response.json({ id: params.id }));
    const response = await router.fetch(makeRequest("/users/123"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toStrictEqual({ id: "123" });
  });

  it("Returns 404 for unsupported method", async () => {
    const router = createRouter();
    router.get("/health-check", () => Response.json({ status: "ok" }));
    const response = await router.fetch(makeRequest("/health-check", { method: "POST" }));

    expect(response.status).toBe(404);
  });

  it("Returns 500 if handler throws", async () => {
    const router = createRouter();
    router.get("/ping", () => {
      throw new Error("No");
    });

    const spy = spyOn(console, "error").mockImplementation(() => {});
    const response = await router.fetch(makeRequest("/ping"));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toStrictEqual({ message: "Internal Server Error" });
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});

describe("Integration: Tests createRouter() Function", () => {
  let server: ReturnType<typeof Bun.serve>;
  const port = 3456;

  beforeAll(() => {
    const router = createRouter();
    router.get("/ping", () => Response.json({ data: "pong" }));
    server = Bun.serve({ port, fetch: router.fetch });
  });

  afterAll(() => server.stop());

  it("Response to GET Endpoint over HTTP", async () => {
    const response = await fetch(new URL("/ping", server.url));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toStrictEqual({ data: "pong" });
  });
});
