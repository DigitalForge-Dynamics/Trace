import type { Context, HttpMethod, Router } from "./router.ts";

type Next = () => Promise<Response>;
type AppMiddleware = (ctx: Context, next: Next) => Promise<Response> | Response;
type RequestWithParams = Request & { readonly params: Record<string, string> };
type MethodHandler = (req: RequestWithParams) => Promise<Response> | Response;
type Routes = Record<string, Partial<Record<HttpMethod, MethodHandler>>>;

interface App {
     use(fn: AppMiddleware): App;
     use(prefix: string, fn: AppMiddleware): App;
     mount(base: `/${string}`, router: Router): App;
     buildRoutes(): Routes;
     fetch(req: Request): Promise<Response>;
}

function createApp(): App {}

export type { Next, AppMiddleware, App }
export { createApp }