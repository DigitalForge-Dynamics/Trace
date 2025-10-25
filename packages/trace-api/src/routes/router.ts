export type HttpMethod = "GET";
export type Context = {
  req: Request;
  url: URL;
  params: Record<string, string>;
};
export type Handler = (ctx: Context) => Promise<Response> | Response;
export type Complied = { regex: RegExp; paramNames: string[] };
type Route = { method: HttpMethod; pattern: Complied; handler: Handler };
export type Router = {
  on: (method: HttpMethod, path: string, handler: Handler) => void;
  get: (path: string, handler: Handler) => void;
  fetch: (req: Request) => Promise<Response>;
};

export const compilePath = (path: string): Complied => {
  if (!path.startsWith("/"))
    throw new Error(`Path must start with "/": ${path}`);

  const names: string[] = [];

  const pattern = path
    .replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
    .replace(/:(\w+)/g, (_m, name) => {
      names.push(name);
      return "([^/]+)";
    });

  const source = path === "/" ? "^/$" : `^${pattern}/?$`;
  return { regex: new RegExp(source), paramNames: names };
};

export const buildParams = (
  compiled: Complied,
  pathname: string
): Record<string, string> | null => {
  const match = compiled.regex.exec(pathname);
  if (!match) return null;

  const values = match.slice(1);
  if (values.length !== compiled.paramNames.length) return null;

  const params = compiled.paramNames.reduce<Record<string, string>>(
    (acc, key, i) => {
      const v = values[i];
      if (typeof key == "string" && typeof v == "string") {
        acc[key] = v;
      }
      return acc;
    },
    {}
  );

  return params;
};

export const createRouter = (): Router => {
  const routes: Route[] = [];

  const on: Router["on"] = (
    method: HttpMethod,
    path: string,
    handler: Handler
  ) => {
    routes.push({
      method: method,
      pattern: compilePath(path),
      handler,
    });
  };

  const get: Router["get"] = (path: string, handler: Handler) =>
    on("GET", path, handler);

  const fetch: Router["fetch"] = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const method = req.method.toUpperCase();

    const route = routes.find(
      (r) => r.method === method && r.pattern.regex.test(url.pathname)
    );

    if (!route) {
      return new Response("Not Found", { status: 404 });
    }

    const params = buildParams(route.pattern, url.pathname);
    if (!params) return new Response("Not Found", { status: 404 }); 

    const ctx: Context = { req, url, params };

    try {
      return await route.handler(ctx);
    } catch (err) {
      console.error("Handler error:", err);
      return new Response("Internal Server Error", { status: 500 });
    }
  };
  return { on, get, fetch };
};