import { describe, it, expect, spyOn, beforeAll, afterAll } from "bun:test";
import { buildParams, compilePath, createRouter } from "./router";

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

    expect(compiled.paramNames).toEqual(["id"]);
    expect(!!match).toBeTrue();
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

    expect(params).toEqual({ x: "one", y: "two" });
  });

  it("Returns null when no match", () => {
    const compiled = compilePath("/a/:x/b/:y");

    expect(buildParams(compiled, "/a/one/b")).toBeNull();
  });

  it("Supports trailing slash", () => {
    const compiled = compilePath("/a/:x");
    const params = buildParams(compiled, "/a/six/");

    expect(params).toEqual({ x: "six" });
  });
});

describe("Unit: Tests createRouter() Function", () => {
  const makeRequest = (path: string, init?: RequestInit) =>
    new Request(`https://localhost${path}`, init);

  it("Dispatched to matching GET route", async () => {
    const router = createRouter();
    router.get("/hello-world", () => new Response("Hello World"));
    const response = await router.fetch(makeRequest("/hello-world"));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("Hello World");
  });

  it("Injects params into handler context", async () => {
    const router = createRouter();
    router.get("/users/:id", ({ params }) => new Response(params["id"]));
    const response = await router.fetch(makeRequest("/users/123"));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("123");
  });

  it("Returns 404 for unsupported method", async () => {
    const router = createRouter();
    router.get("/health-check", () => new Response("ok"));
    const response = await router.fetch(
      makeRequest("/health-check", { method: "POST" })
    );

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
    expect(await response.text()).toBe("Internal Server Error");
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});

describe("Integration: Tests createRouter() Function", () => {
  let server: ReturnType<typeof Bun.serve>;
  const port = 3456;

  beforeAll(() => {
    const router = createRouter();
    router.get("/ping", () => new Response("pong"));
    server = Bun.serve({ port, fetch: router.fetch });
  });

  afterAll(() => server.stop());

  it("Response to GET Endpoint over HTTP", async () => {
    const response = await fetch(`http://localhost:${port}/ping`);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("pong");
  });
});
