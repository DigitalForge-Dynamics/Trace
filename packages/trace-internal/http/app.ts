import type { Context, HttpMethod, Router } from "./router.ts";

type Next = () => Promise<Response>;
type AppMiddleware = (ctx: Context, next: Next) => Promise<Response> | Response;
type RequestWithParams = Request & { readonly params: Record<string, string> };
type MethodHandler = (req: RequestWithParams) => Promise<Response> | Response;
type Routes = Record<string, Partial<Record<HttpMethod, MethodHandler>>>;
interface MountedRouter {
  readonly prefix: `/${string}`;
  readonly router: Router;
}
interface PrefixMount {
  readonly prefix: `/${string}`;
  readonly mw: AppMiddleware;
}

interface App {
  use(fn: AppMiddleware): void;
  use(prefix: string, fn: AppMiddleware): void;
  mount(base: `/${string}`, router: Router): void;
  buildRoutes(): Routes;
  fetch(req: Request): Promise<Response>;
}

function createApp(): App {
  const globals: AppMiddleware[] = [];
  const prefixMounts: PrefixMount[] = [];
  const mountedRouters: MountedRouter[] = [];

  function use(fn: AppMiddleware): void;
  function use(prefix: `/${string}`, fn: AppMiddleware): void;
  function use(a: AppMiddleware | `/${string}`, b?: AppMiddleware): void {
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

  function mount(prefix: `/${string}`, router: Router): void {
    mountedRouters.push({ prefix, router });
  }

  function buildRoutes(): Routes {};

  function fetch(req: Request): Promise<Response> {}

  return { use, mount, buildRoutes, fetch };
}

export type { Next, AppMiddleware, App };
export { createApp };
