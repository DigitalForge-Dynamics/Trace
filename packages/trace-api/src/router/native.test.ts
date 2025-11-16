import { describe, expect, it, mock, spyOn } from "bun:test";
import { Router } from "./native.ts";

describe("Unit: Native Router", () => {
  const request = {
    ...new Request("https://localhost:0"),
    params: {},
  };

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
    subRouter.get("/", () => new Response());
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
    const handler = routes["/foo"]!.GET!;
    await expect(handler(request)).resolves.toMatchObject({ status: 200 });
  });

  it("Invoked pre-defined middleware, until a Response is generated", async () => {
    const router = new Router();
    router.middleware(() => null);
    router.middleware(() => new Response(null, { status: 204 }));
    router.get("/foo", () => new Response(null, { status: 501 }));
    const routes = router.toNative();
    const handler = routes["/foo"]!.GET!;
    await expect(handler(request)).resolves.toMatchObject({ status: 204 });
  });

  it("Does not invoke post-defined middleware", async () => {
    const router = new Router();
    const postMiddleware = mock();
    router.get("/foo", () => new Response());
    router.middleware(postMiddleware);

    const routes = router.toNative();
    const handler = routes["/foo"]!.GET!;
    await expect(handler(request)).resolves.toBeInstanceOf(Response);
    expect(postMiddleware).not.toHaveBeenCalled();
  });

  it("Defaults to 500 response when a route throws an error", async () => {
    const router = new Router();
    router.get("/foo", () => {
      throw new Error("Unexpected error");
    });

    const routes = router.toNative();
    const handler = routes["/foo"]!.GET!;
    const consoleError = spyOn(console, "error").mockImplementation(() => {});
    await expect(handler({ ...request, method: "GET", url: "/foo" })).resolves.toMatchObject({ status: 500 });
    consoleError.mockRestore();
  });

  it("Defaults to 500 response when a middleware layer throws an error", async () => {
    const router = new Router();
    router.middleware(() => {
      throw new Error("Unexpected error");
    });
    router.get("/foo", () => new Response());

    const routes = router.toNative();
    const handler = routes["/foo"]!.GET!;
    const consoleError = spyOn(console, "error").mockImplementation(() => {});
    await expect(handler({ ...request, method: "GET", url: "/foo" })).resolves.toMatchObject({ status: 500 });
    consoleError.mockRestore();
  });

  it("Invokes an error handler if defined when an error is thrown", async () => {
    const router = new Router();
    router.errorHandler(() => new Response(null, { status: 418 }));
    router.get("/foo", () => {
      throw new Error("Unexpected error");
    });

    const routes = router.toNative();
    const handler = routes["/foo"]!.GET!;
    await expect(handler(request)).resolves.toMatchObject({ status: 418 });
  });

  it("Invokes the most recent error handler, when an error is thrown", async () => {
    const router = new Router();
    router.errorHandler(() => new Response(null, { status: 500 }));
    router.errorHandler(() => new Response(null, { status: 418 }));
    router.get("/foo", () => {
      throw new Error("Unexpected error");
    });

    const routes = router.toNative();
    const handler = routes["/foo"]!.GET!;
    await expect(handler(request)).resolves.toMatchObject({ status: 418 });
  });

  it("Invokes the nested errorHandler if defined on a mounted router, when an error is thrown", async () => {
    const router = new Router();
    router.errorHandler(() => new Response(null, { status: 500 }));

    const mounted = new Router();
    mounted.errorHandler(() => new Response(null, { status: 418 }));
    mounted.get("/bar", () => {
      throw new Error("Unexpected error");
    });
    router.mount("/foo", mounted);

    const routes = router.toNative();
    const handler = routes["/foo/bar"]!.GET!;
    await expect(handler(request)).resolves.toMatchObject({ status: 418 });
  });
});

describe("Types: Native Router", () => {
  it("Does not infer parameters that are not present", () => {
    const router = new Router();
    router.get("/foo", (req) => {
      // @ts-expect-error // Intentionally check that type is not present
      req.params.check_absence;
      return new Response();
    });
  });

  it("Infers parameter on singular handler", () => {
    const router = new Router();
    router.get("/:id", (req) => {
      req.params satisfies { id: string };
      return new Response(req.params.id);
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
      return new Response(req.params.id);
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
      return new Response();
    });

    inner.mount("/:bar", child);
    outer.mount("/:foo", inner);
  });
});
