import { exportJWK, type GenerateKeyPairResult, generateKeyPair, jwtVerify } from "jose";
import { Router } from "trace-router";
import type { HealthCheckResponse } from "trace-schemas";
import { ZodError } from "zod";
import { corsHeaders, setupConfiguration } from "./config.ts";
import { db } from "./db.ts";
import { authenticateOidc, getOidcConfig } from "./handlers/oidc.ts";
import { createUser, linkUserIdp } from "./handlers/users.ts";

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

router.middleware(async (req) => {
  try {
    // biome-ignore lint/security/noSecrets: String literal is not a secret
    const token = req.headers.get("Authorization")?.substring("Bearer ".length);
    if (!token) {
      throw new Error("Missing Token");
    }
    await jwtVerify(token, jwks.publicKey);
    return null;
  } catch {
    // biome-ignore lint/security/noSecrets: String literal is not a secret
    return Response.json({ message: "Unauthorised" }, { status: 401 });
  }
});

router.post("/user", createUser);
router.post("/user/link", linkUserIdp);

const startServer = async (port: number): Promise<ReturnType<typeof Bun.serve>> => {
  await db.baseline();
  await setupConfiguration(db);
  const server = Bun.serve({
    port,
    hostname: "localhost",
    routes: router.toNative(corsHeaders),
  });
  console.log(`Server running at ${server.url}`);
  return server;
};

if (Bun.env.NODE_ENV !== "test") {
  await startServer(3000);
}

export { startServer };
