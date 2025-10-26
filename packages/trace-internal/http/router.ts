type HttpMethod = "GET" | "POST";
interface Context {
    readonly req: Request;
    readonly url: URL;
    readonly param: Readonly<Record<string, string>>
}
type Handler = (ctx: Context) => Promise<Response> | Response;
type RouteMiddleware = (ctx: Context, next: () => Promise<Response>) => Promise<Response> | Response;
interface Route {
    readonly method: HttpMethod;
    readonly path: string;
    readonly handler: Handler;
}
interface Router {
    readonly use: (mw: RouteMiddleware) => void;
    readonly get: (path: string, handler: Handler) => void;
    readonly exportRoutes: () => readonly Route[];
    readonly exportRouteMiddleware: () => readonly RouteMiddleware[];
}

function createRouter(): Router {
    const routeTable: Route[] = [];
    const routeRouteMiddleware: RouteMiddleware[] = [];

    function use(mw: RouteMiddleware): void {
        routeRouteMiddleware.push(mw);
    }

    function get(path: string, handler: Handler): void {
        routeTable.push({ method: "GET", path, handler })
    }

    function exportRoutes(): readonly Route[] {
        return routeTable.slice();
    }

    function exportRouteMiddleware(): readonly RouteMiddleware[] {
        return routeRouteMiddleware.slice();
    }

    return { use, get, exportRouteMiddleware, exportRoutes }
}

export type { HttpMethod, Context, Handler, RouteMiddleware, Route, Router }
export { createRouter }