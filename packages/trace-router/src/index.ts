import type { BunRequest } from "bun";

type Params = Record<never, never>;
// NOTE: Taken from `bun-types`.
// Change from https://github.com/oven-sh/bun/pull/24872 changed inferred type for `string` from `Record<never,string> / {}` to `Record<string,string>`.
type ExtractRouteParams<T> = T extends `${string}:${infer Param}/${infer Rest}`
  ? { [K in Param]: string } & ExtractRouteParams<Rest>
  : T extends `${string}:${infer Param}`
    ? { [K in Param]: string }
    : T extends `${string}*`
      ? {}
      : {};

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

type NativeHandler<TParams extends Params> = (
  req: Omit<BunRequest, "params"> & { params: TParams },
) => Promise<Response> | Response;
type ErrorHandler = (req: BunRequest, error: unknown) => Promise<Response> | Response;
type Route<TParams extends Params, TPath extends string> = {
  readonly path: TPath;
  readonly method: HttpMethod;
  readonly handler: NativeHandler<TParams & ExtractRouteParams<TPath>>;
};
type Middleware<TParams extends Params> = (
  req: BunRequest & { params: TParams },
) => Promise<Response> | Response | Promise<null> | null | Promise<Response | null>;

type Layer =
  | { type: "route"; route: Route<Params, string> }
  | { type: "router"; prefix: string; router: Router<Params> }
  | { type: "middleware"; middleware: Middleware<Params> }
  | { type: "error"; handler: ErrorHandler };

type GeneratedRoutes = Record<string, Partial<Record<HttpMethod, NativeHandler<Params>>>>;

/**
 * Custom middleware based routing, allowing for ExpressJS style interface.
 * Using strictly typed route handlers for type inference from path parameters.
 * See Unit Tests for examples.
 */
class Router<in out TParams extends Params> {
  private readonly layers: Layer[];

  constructor() {
    this.layers = [];
  }

  /**
   * Define a route, with handler for the GET HTTP Method
   * @param path - Path on which to define handler.
   * @param handler - Strictly typed handler, for corresponding path.
   * @return Router to allow for chaining definitions.
   */
  get<TPath extends `/${string}`>(path: TPath, handler: NativeHandler<TParams & ExtractRouteParams<TPath>>): this {
    return this.on("GET", path, handler);
  }

  /**
   * Define a route, with handler for the POST HTTP Method
   * @param path - Path on which to define handler.
   * @param handler - Strictly typed handler, for corresponding path.
   * @return Router to allow for chaining definitions.
   */
  post<TPath extends `/${string}`>(path: TPath, handler: NativeHandler<TParams & ExtractRouteParams<TPath>>): this {
    return this.on("POST", path, handler);
  }

  /**
   * Define a route, with handler for the PUT HTTP Method
   * @param path - Path on which to define handler.
   * @param handler - Strictly typed handler, for corresponding path.
   * @return Router to allow for chaining definitions.
   */
  put<TPath extends `/${string}`>(path: TPath, handler: NativeHandler<TParams & ExtractRouteParams<TPath>>): this {
    return this.on("PUT", path, handler);
  }

  /**
   * Define a route, with handler for the PATCH HTTP Method
   * @param path - Path on which to define handler.
   * @param handler - Strictly typed handler, for corresponding path.
   * @return Router to allow for chaining definitions.
   */
  patch<TPath extends `/${string}`>(path: TPath, handler: NativeHandler<TParams & ExtractRouteParams<TPath>>): this {
    return this.on("PATCH", path, handler);
  }

  /**
   * Define a route, with handler for the DELETE HTTP Method
   * @param path - Path on which to define handler.
   * @param handler - Strictly typed handler, for corresponding path.
   * @return Router to allow for chaining definitions.
   */
  delete<TPath extends `/${string}`>(path: TPath, handler: NativeHandler<TParams & ExtractRouteParams<TPath>>): this {
    return this.on("DELETE", path, handler);
  }

  /**
   * Define a route, with handler for the OPTION HTTP Method
   * @param path - Path on which to define handler.
   * @param hander - Strictly typed handler, for corresponding path.
   * @return Router to allow for chaining definitions.
   */
  options<TPath extends `/${string}`>(path: TPath, handler: NativeHandler<TParams & ExtractRouteParams<TPath>>): this {
    return this.on("OPTIONS", path, handler);
  }

  /**
   * Add a layer of middleware to run on all routes.
   * @param middleware - Middleware function.
   * @return Router to allow for chaining definitions.
   */
  middleware(middleware: Middleware<TParams>): this {
    this.layers.push({
      type: "middleware",
      // Type cast needed, as the internal implementation details of `layers` is more weakly typed than the strictly typed function parameters.
      middleware: middleware as Middleware<Params>,
    });
    return this;
  }

  /**
   * Add another router to allow for gradual path dispatch.
   * @param prefix - The path prefix on which to route to router.
   * @param router - The sub router.
   * @return Router to allow for chaining definitions.
   */
  mount<TPath extends `/${string}`>(prefix: TPath, router: Router<TParams & ExtractRouteParams<TPath>>): this {
    this.layers.push({
      type: "router",
      prefix,
      // Type cast needed, as the internal implementation details of `layers` is more weakly typed than the strictly typed function parameters.
      router: router as Router<any>,
    });
    return this;
  }

  /**
   * Define a new error handler for errors thrown during routes.
   * The handler that is invoked will be the last one defined before the route that throws.
   * @param handler - The error handler.
   */
  errorHandler(handler: ErrorHandler): this {
    this.layers.push({
      type: "error",
      handler,
    });
    return this;
  }

  /**
   * Create a Bun Routes object, from the middleware stack.
   * @return Bun Routes - The aggregated handlers, accounting for error handling, and middleware stacks.
   */
  toNative(headers?: Headers): Bun.Serve.Routes<unknown, string> & GeneratedRoutes {
    const result: GeneratedRoutes = {} satisfies Bun.Serve.Routes<unknown, string>;
    const accumulatedMiddleware: Middleware<Params>[] = [];
    let errorHandler: ErrorHandler = Router.defaultErrorHandler;
    for (const layer of this.layers) {
      switch (layer.type) {
        case "error": {
          errorHandler = layer.handler;
          continue;
        }
        case "middleware": {
          accumulatedMiddleware.push(layer.middleware);
          continue;
        }
        case "router": {
          layer.router.layers.unshift({
            type: "error",
            handler: errorHandler,
          });
          const mounted = layer.router.toNative();
          layer.router.layers.shift();
          const middlewareCount = accumulatedMiddleware.length;
          const middleware = accumulatedMiddleware.slice(0, middlewareCount);

          for (const [subPath, value] of Object.entries(mounted)) {
            const mountedPath = Router.genMountPath(layer.prefix, subPath);
            for (const [method, handler] of Object.entries(value)) {
              if (result[mountedPath] && method in result[mountedPath]) {
                throw new Error(`Cannot indirectly redefine route handler for ${method} ${mountedPath}`);
              }
              result[mountedPath] = {
                ...result[mountedPath],
                [method]: (req: BunRequest): Promise<Response> => Router.handleWithMiddleware(req, handler, middleware),
              };
            }
          }
          continue;
        }
        case "route": {
          const middlewareCount = accumulatedMiddleware.length;
          const savedErrorHandler = errorHandler;
          const generatedHandler = async (req: BunRequest & { params: TParams }): Promise<Response> => {
            try {
              const middleware = accumulatedMiddleware.slice(0, middlewareCount);
              const response = await Router.handleWithMiddleware(req, layer.route.handler, middleware);
              if (headers) {
                headers.forEach((value, key) => {
                  response.headers.set(key, response.headers.get(key) ?? value);
                });
              }
              return response;
            } catch (error) {
              return savedErrorHandler(req, error);
            }
          };
          if (result[layer.route.path]?.[layer.route.method]) {
            throw new Error(`Cannot redefine route handler for ${layer.route.method} ${layer.route.path}`);
          }
          result[layer.route.path] = {
            ...result[layer.route.path],
            [layer.route.method]: generatedHandler,
          };
          continue;
        }
        default: {
          layer satisfies never;
        }
      }
    }
    return result;
  }

  /**
   * The default error handler if one is not defined within the routing tree.
   * @param req - The Bun server request
   * @param error - The value that was thrown during running a route handler.
   * @return Response - The response for Bun Server to return to the client.
   */
  static defaultErrorHandler(req: BunRequest, error: unknown): Response {
    console.error(`Unexpected error when handling ${req.method} ${req.url}`);
    if (error instanceof Error) {
      console.error(`Further info: ${error.name}, ${error.message}: ${error.stack}`);
    }
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }

  private static async handleWithMiddleware(
    req: BunRequest,
    handler: NativeHandler<Params>,
    middleware: Middleware<Params>[],
  ): Promise<Response> {
    for (const middle of middleware) {
      const output = await middle(req);
      if (output === null) {
        continue;
      }
      return output;
    }
    return handler(req);
  }

  private on<TPath extends `/${string}`>(
    method: HttpMethod,
    path: TPath,
    handler: NativeHandler<TParams & ExtractRouteParams<TPath>>,
  ): this {
    this.layers.push({
      type: "route",
      route: {
        method,
        path,
        // Type cast needed, as the internal implementation details of `layers` is more weakly typed than the strictly typed function parameters.
        handler: handler as NativeHandler<Params>,
      },
    });
    return this;
  }

  private static genMountPath(prefix: string, subPath: string): string {
    if (prefix === "/") {
      return subPath;
    }
    if (subPath === "/") {
      return prefix;
    }
    return `${prefix}${subPath}`;
  }
}

export { Router };
