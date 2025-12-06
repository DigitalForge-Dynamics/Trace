import { exportJWK, type GenerateKeyPairResult, generateKeyPair } from "jose";
import { Router } from "trace-router";
import type { HealthCheckResponse } from "trace-schemas";
import { ZodError } from "zod";
import { corsHeaders, setupConfiguration } from "./config.ts";
import { db } from "./db.ts";
import { authenticateOidc, getOidcConfig } from "./handlers/oidc.ts";
import { createUser, linkUserIdp } from "./handlers/users.ts";
import { authenticateRequest } from "./middleware/authentication.ts";

const jwks: GenerateKeyPairResult = await generateKeyPair("ES256");
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
  await db.baseline();
  await setupConfiguration(db);
  const server = Bun.serve({
    port,
    hostname: "localhost",
    routes: router.toNative(corsHeaders),
    fetch: async (req: Request) => {
      const res = await authenticateRequest(req, jwks.publicKey);
      if (res === null) {
        return Response.json({ message: "Not Found" }, { status: 404 });
      }
      return res;
    },
  });
  console.log(`Server running at ${server.url}`);
  return server;
};

if (Bun.env.NODE_ENV !== "test") {
  await startServer(3000);
}

export { startServer };
