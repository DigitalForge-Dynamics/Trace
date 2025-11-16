import type { BunRequest } from "bun";
type Params = Record<never, never>;

type HttpMethod = "GET" | "POST";

type NativeHandler<TParams extends Params> = (req: Request & { params: TParams }) => Promise<Response> | Response;
type ErrorHandler = (req: Request, error: unknown) => Promise<Response> | Response;
type Route<TParams extends Params> = {
  readonly path: string;
  readonly method: HttpMethod;
  readonly handler: NativeHandler<TParams>;
};
type Middleware = (req: Request) => Promise<Response> | Response | Promise<null> | null;

type Layer =
  | { type: "route"; route: Route<Params> }
  | { type: "router"; prefix: string; router: Router<Params> }
  | { type: "middleware"; middleware: Middleware }
  | { type: "error"; handler: ErrorHandler };

class Router<in out TParams extends Params> {
  private readonly layers: Layer[];

  constructor() {
    this.layers = [];
  }

  public get<TPath extends string>(path: TPath, handler: NativeHandler<TParams & Bun.Serve.ExtractRouteParams<TPath>>): this {
    this.layers.push({
      type: "route",
      route: {
        method: "GET",
        path,
        handler: handler as any,
      },
    });
    return this;
  }

  public post<TPath extends string>(path: TPath, handler: NativeHandler<TParams & Bun.Serve.ExtractRouteParams<TPath>>): this {
    this.layers.push({
      type: "route",
      route: {
        method: "POST",
        path,
        handler: handler as any,
      },
    });
    return this;
  }

  public middleware(middleware: Middleware): this {
    this.layers.push({
      type: "middleware",
      middleware,
    });
    return this;
  }

  public mount<TPath extends string>(prefix: TPath, router: Router<TParams & Bun.Serve.ExtractRouteParams<TPath>>): this {
    this.layers.push({
      type: "router",
      prefix,
      router: router as any,
    });
    return this;
  }

  public errorHandler(handler: ErrorHandler): this {
    this.layers.push({
      type: "error",
      handler,
    });
    return this;
  }

  public toNative(): Bun.Serve.Routes<any, any> {
    const result: Bun.Serve.Routes<any, any> = {};
    const accumulatedMiddleware: Middleware[] = [];
    let errorHandler: ErrorHandler = (req, error): Response => {
      console.error(`Unexpected error when handling ${req.method} ${req.url}`);
      if (error instanceof Error) {
        console.error(`Further info: ${error.name}, ${error.message}: ${error.stack}`);
      }
      return Response.json({ message: "Internal Server Error" }, { status: 500 });
    };

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
          const mounted = layer.router.toNative();
          for (const [subPath, value] of Object.entries(mounted)) {
            const mountedPath =
              subPath === "/"
                ? layer.prefix
                : subPath.startsWith("/")
                  ? `${layer.prefix}${subPath}`
                  : `${layer.prefix}/${subPath}`;
            result[mountedPath] = value;
          }
          continue;
        }
        case "route": {
          result[layer.route.path] = result[layer.route.path] ?? {};
          const middleware = [...accumulatedMiddleware];
          const generatedHandler = async (req: BunRequest): Promise<Response> => {
            try {
              for (const middle of middleware) {
                const output = await middle(req);
                if (output === null) continue;
                return output;
              }
              return layer.route.handler(req);
            } catch (error) {
              return errorHandler(req, error);
            }
          };
          // @ts-expect-error
          result[layer.route.path][layer.route.method] = generatedHandler;
          continue;
        }
        default: {
          layer satisfies never;
        }
      }
    }
    return result;
  }
}

export { Router };
