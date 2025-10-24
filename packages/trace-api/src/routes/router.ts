type Context = { req: Request; url: URL; params: Record<string, string> };
type Handler = (ctx: Context) => Promise<Response> | Response;
type Route = { method: string; pattern: RegExp; handler: Handler };
type Router = {
  on: (method: string, path: string, handler: Handler) => void;
  get: (path: string, handler: Handler) => void;
  fetch: (req: Request) => Promise<Response>;
};

const compilePath = (path: string): RegExp => {
  if (!path.startsWith("/"))
    throw new Error(`Path must start with "/": ${path}`);

  const pattern = path
    .replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
    .replace(/\\:(\w+)/g, (_m, name) => `(?<${name}>[^/]+)`);

  const final = path === "/" ? "^/$" : `^${pattern}/?$`;
  return new RegExp(final);
};

const createRouter = (): Router => {
  const routes: Route[] = [];

  const on = (method: string, path: string, handler: Handler) => {
    routes.push({
      method: method.toUpperCase(),
      pattern: compilePath(path),
      handler,
    });
  };
  const get = (path: string, h: Handler) => on("GET", path, h);

  const fetch = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const method = req.method.toUpperCase();

    for (const route of routes) {
      if (route.method !== method) continue;
      const match = route.pattern.exec(url.pathname);
      if (!match) continue;

      const params = (match.groups ?? {});
      const ctx: Context = { req, url, params };

      try {
        return await route.handler(ctx);
      } catch (err) {
        console.error("Handler error:", err);
        return new Response("Internal Server Error", { status: 500 });
      }
    }
    return new Response("Not Found", { status: 404 });
  };

  return { on, get, fetch };
};

export type { Context, Handler, Router };
export { createRouter };
