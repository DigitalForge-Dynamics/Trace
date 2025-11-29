import { Router } from "trace-router";
import type { HealthCheckResponse } from "trace-schemas";
import { ZodError } from "zod";
import { corsHeaders, setupConfiguration } from "./config.ts";
import { db } from "./db.ts";
import { authenticateOidc, getOidcConfig } from "./handlers/auth.ts";
import { createUser, linkUserIdp } from "./handlers/users.ts";

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
router.options("/auth/oidc", () => new Response(null, { status: 200, headers: corsHeaders }));
router.post("/auth/oidc", authenticateOidc);
router.get("/auth/oidc/config", getOidcConfig);
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
