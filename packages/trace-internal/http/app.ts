import { createRouter, type Context, type HttpMethod, type Route, type Router } from "./router.ts";

type Prefix = `/${string}`;
type Next = () => Promise<Response>;
type AppMiddleware = (ctx: Context, next: Next) => Promise<Response> | Response;
type RequestWithParams = Request & { readonly params: Record<string, string> };
type MethodHandler = (req: RequestWithParams) => Promise<Response> | Response;
type Routes = Record<string, Partial<Record<HttpMethod, MethodHandler>>>;
interface MountedRouter {
  readonly prefix: Prefix;
  readonly router: Router;
}
interface PrefixMount {
  readonly prefix: Prefix;
  readonly mw: AppMiddleware;
}

interface App {
  use(fn: AppMiddleware): void;
  use(prefix: string, fn: AppMiddleware): void;
  mount(base: Prefix, router: Router): void;
  buildRoutes(): Routes;
  fetch(req: Request): Promise<Response>;
}

function compose(middlewares: readonly AppMiddleware[]): AppMiddleware {
  return (ctx: Context, next: Next) => {
    let index = -1;
    async function step(i: number): Promise<Response> {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      const fn = i < middlewares.length ? middlewares[i] : next;

      if (!fn) {
        return new Response("Not Found", { status: 404 });
      }
      return await Promise.resolve(fn(ctx, () => step(i + 1)));
    }
    return step(0);
  };
}

function makeEndpoint(def: Route): AppMiddleware {
    return (ctx: Context) => {
        const out: Context = { req: ctx.req, url: ctx.url, param: ctx.param };
        return def.handler(out);
    }
}

function concatPaths(base: Prefix, child: Prefix): string {
    return (base.endsWith("/") ? base.slice(0, -1) : base) + child;
}

function makeMethodHandler(chain: AppMiddleware): MethodHandler {
    return (req: RequestWithParams) => {
        const ctx: Context = { req, url: new URL(req.url), param: req.params };
        return chain(ctx, async () => new Response("Not Found", { status: 404 }));
    }
}

function createApp(): App {
  const globals: AppMiddleware[] = [];
  const prefixMounts: PrefixMount[] = [];
  const mountedRouters: MountedRouter[] = [];

  function use(fn: AppMiddleware): void;
  function use(prefix: Prefix, fn: AppMiddleware): void;
  function use(a: AppMiddleware | Prefix, b?: AppMiddleware): void {
    if (typeof a === "function" && b === undefined) {
      globals.push(a);
      return;
    }
    if (typeof a === "string" && typeof b === "function") {
      prefixMounts.push({ prefix: a, mw: b });
      return;
    }
    throw new Error("use() expects (fn) or (prefix, fn)");
  }

  function mount(prefix: Prefix, router: Router): void {
    mountedRouters.push({ prefix, router });
  }

  function buildRoutes(): Routes {
    const map = new Map<string, Partial<Record<HttpMethod, MethodHandler>>>();
    const router = createRouter();
  }

  function fetch(_req: Request): Promise<Response> {}

  return { use, mount, buildRoutes, fetch };
}

export type { Next, AppMiddleware, App };
export { createApp };
