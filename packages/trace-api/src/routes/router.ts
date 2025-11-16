type HttpMethod = "GET" | "POST";
type Context = {
  readonly req: Request;
  readonly url: URL;
  readonly params: Record<string, string>;
};
type Handler = (ctx: Context) => Promise<Response> | Response;
type Compiled = { readonly regex: RegExp; readonly paramNames: string[] };
type Route = { readonly method: HttpMethod; readonly pattern: Compiled; readonly handler: Handler };
type Router = {
  readonly on: (method: HttpMethod, path: string, handler: Handler) => void;
  readonly get: (path: string, handler: Handler) => void;
  readonly post: (path: string, handler: Handler) => void;
  readonly fetch: (req: Request) => Promise<Response>;
};

const compilePath = (path: string): Compiled => {
  if (!path.startsWith("/")) {
    throw new Error(`Path must start with "/": ${path}`);
  }

  const names: string[] = [];

  const pattern = path.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/:(\w+)/g, (_m, name) => {
    names.push(name);
    return "([^/]+)";
  });

  const source = path === "/" ? "^/$" : `^${pattern}/?$`;
  return { regex: new RegExp(source), paramNames: names };
};

const buildParams = (compiled: Compiled, pathname: string): Record<string, string> | null => {
  const match = compiled.regex.exec(pathname);
  if (!match) {
    return null;
  }

  const values = match.slice(1);
  if (values.length !== compiled.paramNames.length) {
    return null;
  }

  const params = compiled.paramNames.reduce<Record<string, string>>((acc, key, i) => {
    const v = values[i];
    if (typeof v === "string") {
      acc[key] = v;
    } else {
      console.warn(`Unused parameter name (${key}), with unexpected corresponding type of value: ${typeof v}`);
    }
    return acc;
  }, {});

  return params;
};

const createRouter = (): Router => {
  const routes: Route[] = [];

  const on: Router["on"] = (method: HttpMethod, path: string, handler: Handler) => {
    routes.push({
      method,
      pattern: compilePath(path),
      handler,
    });
  };

  const get: Router["get"] = (path: string, handler: Handler) => on("GET", path, handler);
  const post: Router["post"] = (path: string, handler: Handler) => on("POST", path, handler);

  const fetch: Router["fetch"] = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const method = req.method.toUpperCase();

    const route = routes.find((r) => r.method === method && r.pattern.regex.test(url.pathname));

    if (!route) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }

    const params = buildParams(route.pattern, url.pathname);
    if (!params) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }

    const ctx: Context = { req, url, params };

    try {
      return await route.handler(ctx);
    } catch (err) {
      console.error("Handler error:", err);
      return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
  };

  return { on, get, post, fetch };
};

export type { HttpMethod, Handler, Context, Compiled, Router };
export { createRouter, buildParams, compilePath };
