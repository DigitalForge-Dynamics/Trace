import { Router } from "trace-router";
import type { HealthCheckResponse } from "trace-schemas";
import { corsHeaders, setupConfiguration } from "./config.ts";
import { db } from "./db.ts";
import { authenticateOidc, getOidcConfig } from "./handlers/auth.ts";

const router: Router<Record<string, never>> = new Router();

router.get(
  "/health-check",
  (): Response => Response.json({ health: "OK" } satisfies HealthCheckResponse, { status: 200 }),
);
router.post("/auth/oidc", authenticateOidc);
router.get("/auth/oidc/config", getOidcConfig);

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
