import { describe, expect, it, mock } from "bun:test";
import { Router } from "./native.ts";

describe("Unit: Native Router", () => {
  it("Generates a routes object, from a series of direct routes", () => {
    const router = new Router();
    router.get("/foo", () => new Response());
    router.post("/bar", () => new Response());
    expect(router.toNative()).toStrictEqual({
      "/foo": {
        GET: expect.anything(),
      },
      "/bar": {
        POST: expect.anything(),
      },
    });
  });

  it("Generates multiple method routes, on the same path", () => {
    const router = new Router();
    router.get("/foo", () => new Response());
    router.post("/foo", () => new Response());
    expect(router.toNative()).toStrictEqual({
      "/foo": {
        GET: expect.anything(),
        POST: expect.anything(),
      },
    });
  });

  it("Generates a routes object from a mounted router", () => {
    const router = new Router();
    router.get("/bar", () => new Response());

    const subRouter = new Router();
    subRouter.get("/foo", () => new Response());
    router.mount("/baz", subRouter);

    expect(router.toNative()).toStrictEqual({
      "/bar": {
        GET: expect.anything(),
      },
      "/baz/foo": {
        GET: expect.anything(),
      },
    });
  });

  it("Generates a routes object from a double mounted router", () => {
    const router = new Router();
    router.get("/outer", () => new Response());

    const inner = new Router();
    inner.get("/inner", () => new Response());

    const nested = new Router();
    nested.get("/nested", () => new Response());

    inner.mount("/inner-nested", nested);
    router.mount("/outer-inner", inner);

    expect(router.toNative()).toStrictEqual({
      "/outer": {
        GET: expect.anything(),
      },
      "/outer-inner/inner": {
        GET: expect.anything(),
      },
      "/outer-inner/inner-nested/nested": {
        GET: expect.anything(),
      },
    });
  });

  it("Invokes pre-defined middleware, returning Response if generated", async () => {
    const router = new Router();
    router.middleware(() => new Response(null, { status: 200 }));
    router.get("/foo", () => new Response(null, { status: 501 }));
    const routes = router.toNative();
    // @ts-ignore
    const handler = routes["/foo"].GET;
    await expect(handler()).resolves.toMatchObject({ status: 200 });
  });

  it("Invoked pre-defined middleware, until a Response is generated", async () => {
    const router = new Router();
    router.middleware(() => null);
    router.middleware(() => new Response(null, { status: 204 }));
    router.get("/foo", () => new Response(null, { status: 501 }));
    const routes = router.toNative();
    // @ts-ignore
    const handler = routes["/foo"].GET;
    await expect(handler()).resolves.toMatchObject({ status: 204 });
  });

  it("Does not invoke post-defined middleware", async () => {
    const router = new Router();
    const postMiddleware = mock();
    router.get("/foo", () => new Response());
    router.middleware(postMiddleware);

    const routes = router.toNative();
    // @ts-ignore
    const handler = routes["/foo"].GET;
    await expect(handler()).resolves.toBeInstanceOf(Response);
    expect(postMiddleware).not.toHaveBeenCalled();
  });
});
