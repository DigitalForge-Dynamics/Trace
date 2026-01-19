import { Router } from "@DigitalForge-Dynamics/trace-router";
import type { HealthCheckResponse } from "@DigitalForge-Dynamics/trace-schemas";
import { Database as SqLite } from "bun:sqlite";
import { exportJWK, type GenerateKeyPairResult, generateKeyPair } from "jose";
import { ZodError } from "zod";
import { corsHeaders, setupConfiguration } from "./config.ts";
import { db } from "./db.ts";
import { authenticateOidc, getOidcConfig } from "./handlers/oidc.ts";
import { createUser, linkUserIdp } from "./handlers/users.ts";
import { authenticateRequest } from "./middleware/authentication.ts";
import { RateLimiter, rateLimitRequest } from "./middleware/rate-limit.ts";

const jwks: GenerateKeyPairResult = await generateKeyPair("ES512");
const router: Router<Record<string, never>> = new Router();

router.errorHandler((req, error) => {
  if (error instanceof ZodError) {
    return Response.json({ issues: error.issues });
  }
  const res = Router.defaultErrorHandler(req, error);
  corsHeaders.forEach((key, value) => {
    res.headers.set(key, res.headers.get(key) ?? value);
  });
  return res;
});

router.get(
  "/health-check",
  (): Response => Response.json({ health: "OK" } satisfies HealthCheckResponse, { status: 200 }),
);
// biome-ignore lint/plugin/response-json: CORS Pre-Flight Check.
router.options("/auth/oidc", () => new Response(null));
router.post("/auth/oidc", (req) => authenticateOidc(req, jwks));
router.get("/auth/oidc/.well-known/jwks", async () => {
  const key = await exportJWK(jwks.publicKey);
  return Response.json({ keys: [key] });
});
router.get("/auth/oidc/config", getOidcConfig);

router.middleware((req) => authenticateRequest(req, jwks.publicKey));

router.post("/user", createUser);
router.post("/user/link", linkUserIdp);

const startServer = async (port: number): Promise<ReturnType<typeof Bun.serve>> => {
  await db.migrate();
  await setupConfiguration(db);
  const store = new SqLite(":memory:");
  const limiter = new RateLimiter(store);
  await limiter.init();
  const server = Bun.serve({
    port,
    hostname: "localhost",
    fetch: async (req: Request) => {
      const res = await authenticateRequest(req, jwks.publicKey);
      if (res === null) {
        return Response.json({ message: "Not Found" }, { status: 404 });
      }
      return res;
    },
  });
  const _routes = new Router();
  _routes.middleware((req) => rateLimitRequest(req, server, limiter));
  _routes.mount("/", router);
  // TODO: This middleware prefixing is impractical, since it does not seem to be copying across `errorHandler`.
  //	to be confirmed reasoning for seemingly not.
  _routes.errorHandler(() => new Response("", { status: 500 }));
  server.reload({ routes: _routes.toNative(corsHeaders) });
  console.log(`Server running at ${server.url}`);
  return server;
};

if (Bun.env.NODE_ENV !== "test") {
  await startServer(3000);
}

export { startServer };
