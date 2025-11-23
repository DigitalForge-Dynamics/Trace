import type { BunRequest } from "bun";
import { corsHeaders } from "../config.ts";

type Params = Record<never, never>;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type NativeHandler<TParams extends Params> = (req: BunRequest & { params: TParams }) => Promise<Response> | Response;

type ErrorHandler = (req: BunRequest, error: unknown) => Promise<Response> | Response;
type Route<TParams extends Params, TPath extends string> = {
  readonly path: TPath;
  readonly method: HttpMethod;
  readonly handler: NativeHandler<TParams & Bun.Serve.ExtractRouteParams<TPath>>;
};
type Middleware<TParams extends Params> = (
  req: BunRequest & { params: TParams },
) => Promise<Response> | Response | Promise<null> | null;

type Layer =
  | { type: "route"; route: Route<Params, string> }
  | { type: "router"; prefix: string; router: Router<Params> }
  | { type: "middleware"; middleware: Middleware<Params> }
  | { type: "error"; handler: ErrorHandler };

class Router<in out TParams extends Params> {
  private readonly layers: Layer[];

  constructor() {
    this.layers = [];
  }

  on<TPath extends `/${string}`>(
    method: HttpMethod,
    path: TPath,
    handler: NativeHandler<TParams & Bun.Serve.ExtractRouteParams<TPath>>,
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

  get<TPath extends `/${string}`>(
    path: TPath,
    handler: NativeHandler<TParams & Bun.Serve.ExtractRouteParams<TPath>>,
  ): this {
    return this.on("GET", path, handler);
  }

  post<TPath extends `/${string}`>(
    path: TPath,
    handler: NativeHandler<TParams & Bun.Serve.ExtractRouteParams<TPath>>,
  ): this {
    return this.on("POST", path, handler);
  }

  put<TPath extends `/${string}`>(
    path: TPath,
    handler: NativeHandler<TParams & Bun.Serve.ExtractRouteParams<TPath>>,
  ): this {
    return this.on("PUT", path, handler);
  }

  patch<TPath extends `/${string}`>(
    path: TPath,
    handler: NativeHandler<TParams & Bun.Serve.ExtractRouteParams<TPath>>,
  ): this {
    return this.on("PATCH", path, handler);
  }

  delete<TPath extends `/${string}`>(
    path: TPath,
    handler: NativeHandler<TParams & Bun.Serve.ExtractRouteParams<TPath>>,
  ): this {
    return this.on("DELETE", path, handler);
  }

  middleware(middleware: Middleware<TParams>): this {
    this.layers.push({
      type: "middleware",
      // Type cast needed, as the internal implementation details of `layers` is more weakly typed than the strictly typed function parameters.
      middleware: middleware as Middleware<Params>,
    });
    return this;
  }

  mount<TPath extends `/${string}`>(
    prefix: TPath,
    router: Router<TParams & Bun.Serve.ExtractRouteParams<TPath>>,
  ): this {
    this.layers.push({
      type: "router",
      prefix,
      // Type cast needed, as the internal implementation details of `layers` is more weakly typed than the strictly typed function parameters.
      router: router as Router<any>,
    });
    return this;
  }

  errorHandler(handler: ErrorHandler): this {
    this.layers.push({
      type: "error",
      handler,
    });
    return this;
  }

  toNative(): Bun.Serve.Routes<unknown, string> & Record<string, Partial<Record<HttpMethod, NativeHandler<Params>>>> {
    const result: Record<string, Partial<Record<HttpMethod, NativeHandler<Params>>>> = {} satisfies Bun.Serve.Routes<
      unknown,
      string
    >;
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
          for (const [subPath, value] of Object.entries(mounted)) {
            const mountedPath = (() => {
              if (subPath === "/") {
                return layer.prefix;
              }
              if (layer.prefix === "/") {
                return subPath;
              }
              return `${layer.prefix}${subPath}`;
            })();
            for (const [method, handler] of Object.entries(value)) {
              if (result[mountedPath] && method in result[mountedPath]) {
                throw new Error(`Cannot indirectly redefine route handler for ${method} ${mountedPath}`);
              }
              result[mountedPath] = {
                ...result[mountedPath],
                [method]: async (req: BunRequest & { params: TParams }): Promise<Response> => {
                  const middleware = accumulatedMiddleware.slice(0, middlewareCount);
                  for (const middle of middleware) {
                    const output = await middle(req);
                    if (output === null) {
                      continue;
                    }
                    return output;
                  }
                  return handler(req);
                },
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
              for (const middle of middleware) {
                const output = await middle(req);
                if (output === null) {
                  continue;
                }
                return output;
              }
              const response = await layer.route.handler(req);
              corsHeaders.forEach((value, key) => {
                if (!response.headers.has(key)) {
                  response.headers.set(key, value);
                }
              });
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

  static defaultErrorHandler(req: BunRequest, error: unknown): Response {
    console.error(`Unexpected error when handling ${req.method} ${req.url}`);
    if (error instanceof Error) {
      console.error(`Further info: ${error.name}, ${error.message}: ${error.stack}`);
    }
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export { Router };
