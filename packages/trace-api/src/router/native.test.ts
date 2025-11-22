import { describe, expect, it, mock, spyOn } from "bun:test";
import type { BunRequest } from "bun";
import { Router } from "./native.ts";

describe("Unit: Native Router", () => {
  const request: BunRequest = {
    ...new Request("https://localhost:0"),
    params: {},
    cookies: new Bun.CookieMap(),
    headers: new Headers(),
  } as BunRequest;

  it("Generates a routes object, from a series of direct routes", () => {
    const router = new Router();
    router.get("/foo", () => new Response(null, { status: 204 }));
    router.post("/bar", () => new Response(null, { status: 204 }));
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
    router.get("/foo", () => new Response(null, { status: 204 }));
    router.post("/foo", () => new Response(null, { status: 204 }));
    expect(router.toNative()).toStrictEqual({
      "/foo": {
        GET: expect.anything(),
        POST: expect.anything(),
      },
    });
  });

  it("Generates a routes object from a mounted router", () => {
    const router = new Router();
    router.get("/bar", () => new Response(null, { status: 204 }));

    const subRouter = new Router();
    subRouter.get("/foo", () => new Response(null, { status: 204 }));
    subRouter.get("/", () => new Response(null, { status: 204 }));
    router.mount("/baz", subRouter);

    expect(router.toNative()).toStrictEqual({
      "/bar": {
        GET: expect.anything(),
      },
      "/baz": {
        GET: expect.anything(),
      },
      "/baz/foo": {
        GET: expect.anything(),
      },
    });
  });

  it("Generates a routes object from a double mounted router", () => {
    const router = new Router();
    router.get("/outer", () => new Response(null, { status: 204 }));

    const inner = new Router();
    inner.get("/inner", () => new Response(null, { status: 204 }));

    const nested = new Router();
    nested.get("/nested", () => new Response(null, { status: 204 }));

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

  it("Does not generate a double / for a router mounted at root path", () => {
    const outer = new Router();
    const inner = new Router();
    inner.get("/foo", () => new Response(null, { status: 204 }));
    outer.mount("/", inner);

    const routes = outer.toNative();
    expect(routes).toMatchObject({
      "/foo": expect.anything(),
    });
  });

  it("Invokes pre-defined middleware, returning Response if generated", async () => {
    const router = new Router();
    router.middleware(() => Response.json({ status: "OK" }, { status: 200 }));
    router.get("/foo", () => Response.json({ message: "Unimplemented" }, { status: 501 }));
    const routes = router.toNative();
    const handler = routes["/foo"]?.GET;
    expect(handler).toBeDefined();
    await expect(handler?.(request)).resolves.toMatchObject({ status: 200 });
  });

  it("Invokes pre-defined middleware, until a Response is generated", async () => {
    const router = new Router();
    router.middleware(() => null);
    router.middleware(() => new Response(null, { status: 204 }));
    router.get("/foo", () => Response.json({ message: "Unimplemented" }, { status: 501 }));

    const routes = router.toNative();
    const handler = routes["/foo"]?.GET;
    expect(handler).toBeDefined();
    await expect(handler?.(request)).resolves.toMatchObject({ status: 204 });
  });

  it("Does not invoke post-defined middleware", async () => {
    const router = new Router();
    const postMiddleware = mock();
    router.get("/foo", () => new Response(null, { status: 204 }));
    router.middleware(postMiddleware);

    const routes = router.toNative();
    const handler = routes["/foo"]?.GET;
    expect(handler).toBeDefined();
    await expect(handler?.(request)).resolves.toBeInstanceOf(Response);
    expect(postMiddleware).not.toHaveBeenCalled();
  });

  it("Does invoke pre-defined middleware on parent router, for mounted routes", async () => {
    const router = new Router();
    const inner = new Router();
    const middleware = mock().mockReturnValueOnce(null);
    router.middleware(middleware);
    inner.get("/foo", () => new Response(null, { status: 204 }));
    router.mount("/", inner);

    const routes = router.toNative();
    const handler = routes["/foo"]?.GET;
    expect(handler).toBeDefined();
    await expect(handler?.(request)).resolves.toMatchObject({ status: 204 });
    expect(middleware).toHaveBeenCalled();
  });

  it("Defaults to 500 response when a route throws an error", async () => {
    const router = new Router();
    router.get("/foo", () => {
      throw new Error("Unexpected error");
    });

    const routes = router.toNative();
    const handler = routes["/foo"]?.GET;
    const consoleError = spyOn(console, "error").mockImplementation(() => {});
    expect(handler).toBeDefined();
    await expect(handler?.({ ...request, method: "GET", url: "/foo" })).resolves.toMatchObject({ status: 500 });
    consoleError.mockRestore();
  });

  it("Defaults to 500 response when a middleware layer throws an error", async () => {
    const router = new Router();
    router.middleware(() => {
      throw new Error("Unexpected error");
    });
    router.get("/foo", () => new Response(null, { status: 204 }));

    const routes = router.toNative();
    const handler = routes["/foo"]?.GET;
    const consoleError = spyOn(console, "error").mockImplementation(() => {});
    expect(handler).toBeDefined();
    await expect(handler?.({ ...request, method: "GET", url: "/foo" })).resolves.toMatchObject({ status: 500 });
    consoleError.mockRestore();
  });

  it("Invokes an error handler if defined when an error is thrown", async () => {
    const router = new Router();
    router.errorHandler(() => Response.json({ error: "Cannot brew coffee" }, { status: 418 }));
    router.get("/foo", () => {
      throw new Error("Unexpected error");
    });

    const routes = router.toNative();
    const handler = routes["/foo"]?.GET;
    expect(handler).toBeDefined();
    await expect(handler?.(request)).resolves.toMatchObject({ status: 418 });
  });

  it("Invokes the most recent error handler, when an error is thrown", async () => {
    const router = new Router();
    router.errorHandler(() => Response.json({ error: "Unkown error" }, { status: 500 }));
    router.errorHandler(() => Response.json({ error: "Cannot brew coffee" }, { status: 418 }));
    router.get("/foo", () => {
      throw new Error("Unexpected error");
    });

    const routes = router.toNative();
    const handler = routes["/foo"]?.GET;
    expect(handler).toBeDefined();
    await expect(handler?.(request)).resolves.toMatchObject({ status: 418 });
  });

  it("Does not invoke an error handler, that is defined after the layer throwing an error", async () => {
    const router = new Router();
    router.errorHandler(() => Response.json({ error: "Cannot brew coffee" }, { status: 418 }));
    router.get("/foo", () => {
      throw new Error("Unexpected error");
    });
    router.errorHandler(() => Response.json({ error: "Error handler that should not be invoked" }, { status: 500 }));

    const routes = router.toNative();
    const handler = routes["/foo"]?.GET;
    expect(handler).toBeDefined();
    await expect(handler?.(request)).resolves.toMatchObject({ status: 418 });
  });

  it("Invokes the nested errorHandler if defined on a mounted router, when an error is thrown", async () => {
    const router = new Router();
    router.errorHandler(() =>
      Response.json({ error: "Parent Error Handler that should not be called" }, { status: 500 }),
    );

    const mounted = new Router();
    mounted.errorHandler(() => Response.json({ error: "Cannot brew coffee" }, { status: 418 }));
    mounted.get("/bar", () => {
      throw new Error("Unexpected error");
    });
    router.mount("/foo", mounted);

    const routes = router.toNative();
    const handler = routes["/foo/bar"]?.GET;
    expect(handler).toBeDefined();
    await expect(handler?.(request)).resolves.toMatchObject({ status: 418 });
  });

  it("Invokes an errorHandler on a parent router, if a mounted router without a defined errorHandler, throws an error", async () => {
    const router = new Router();
    router.errorHandler(() => Response.json({ error: "Cannot brew coffee" }, { status: 418 }));

    const mounted = new Router();
    mounted.get("/bar", () => {
      throw new Error("Unexpected error");
    });
    router.mount("/foo", mounted);

    const routes = router.toNative();
    const handler = routes["/foo/bar"]?.GET;
    expect(handler).toBeDefined();
    await expect(handler?.(request)).resolves.toMatchObject({ status: 418 });
  });

  it("Throws an error when multiple handlers are directly defined for a route", () => {
    const router = new Router();
    router.get("/foo", () => Response.json({ error: "Cannot brew coffee" }, { status: 418 }));
    router.get("/foo", () => Response.json({ error: "Later definition that should not be called" }, { status: 500 }));

    expect(() => router.toNative()).toThrowError();
  });

  it("Throws an error when multiple handlers are indirectly defined for a route, using mounted routers", () => {
    const outer = new Router();
    const inner = new Router();

    inner.get("/", () => Response.json({ error: "Conflicting route, that should not be invoked" }, { status: 500 }));
    outer.get("/foo", () => Response.json({ error: "Cannot brew coffee" }, { status: 418 }));
    outer.mount("/foo", inner);

    expect(() => outer.toNative()).toThrowError();
  });

  it("Permits split route definitions, as long as they do not conflict on methods", async () => {
    const outer = new Router();
    const inner = new Router();

    inner.post("/", () => Response.json(null, { status: 204 }));
    outer.get("/foo", () => Response.json({ error: "Cannot brew coffee" }, { status: 418 }));
    outer.mount("/foo", inner);

    const routes = outer.toNative();
    const handler = routes["/foo"]?.GET;
    expect(handler).toBeDefined();
    await expect(handler?.(request)).resolves.toMatchObject({ status: 418 });
  });
});

describe("Types: Native Router", () => {
  it("Does not infer parameters that are not present", () => {
    const router = new Router();
    router.get("/foo", (req) => {
      // @ts-expect-error // Intentionally check that type is not present
      req.params.check_absence;
      return new Response(null, { status: 204 });
    });
  });

  it("Infers parameter on singular handler", () => {
    const router = new Router();
    router.get("/:id", (req) => {
      req.params satisfies { id: string };
      return Response.json({ id: req.params.id });
    });
  });

  it("Infers multiple parameters on singular handler", () => {
    const router = new Router();
    router.get("/:id/foo/:uuid", (req) => {
      req.params satisfies { id: string; uuid: string };
      return Response.json({ id: req.params.id, uuid: req.params.uuid });
    });
  });

  it("Transfers the parameters from nested routers", () => {
    const router = new Router();

    const subRouter = new Router<{ id: string }>();
    subRouter.get("/:foo", (req) => {
      req.params satisfies { id: string; foo: string };
      return Response.json({ id: req.params.id });
    });

    router.mount("/:id", subRouter);
  });

  it("Requires mounting a router to provide all requested parameters", () => {
    const router = new Router();

    const subRouter = new Router<{ id: string; bar: string }>();
    // @ts-expect-error // This should fail to mount, since it's missing the `/:bar` parameter.
    router.mount("/:id", subRouter);
  });

  it("Allows the nesting of path parameters", () => {
    const outer = new Router();
    const inner = new Router<{ foo: string }>();
    const child = new Router<{ foo: string; bar: string }>();

    child.get("/:baz", (req) => {
      req.params satisfies { foo: string; bar: string; baz: string };
      return new Response(null, { status: 204 });
    });

    inner.mount("/:bar", child);
    outer.mount("/:foo", inner);
  });

  it("Allows path parameter types within middleware handlers", () => {
    const inner = new Router<{ id: string }>();
    inner.middleware((req) => {
      req.params satisfies { id: string };
      return new Response(null, { status: 204 });
    });
  });

  it("Requires the router's generic parameter to have values of string", () => {
    const outer = new Router();
    const inner = new Router<{ id: unknown }>();
    inner.middleware((req) => {
      req.params satisfies { id: unknown };
      return new Response(null, { status: 204 });
    });
    // @ts-expect-error // Should fail, as `unknown` does not satisfy `string`.
    outer.mount("/:id", inner);
  });

  it("Does not permit defining path parameters, that are not accepted by mounted routers", () => {
    const outer = new Router();
    const inner = new Router<{ id: string }>();

    // @ts-expect-error // Should fail, as `{ id: string }` is unused by `inner` - so is indicative of user error.
    outer.mount("/:id/:foo", inner);
  });
});
