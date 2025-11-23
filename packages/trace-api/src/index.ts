import type { HealthCheckResponse } from "trace-schemas";
import { authenticateOidc, getOidcConfig } from "./handlers/auth.ts";
import { Router } from "./router/native.ts";

const router: Router<Record<string, never>> = new Router();

router.get(
  "/health-check",
  (): Response => Response.json({ health: "OK" } satisfies HealthCheckResponse, { status: 200 }),
);
router.post("/auth/oidc", authenticateOidc);
router.get("/auth/oidc/config", getOidcConfig);

const startServer = (port: number): ReturnType<typeof Bun.serve> => {
  const server = Bun.serve({
    port,
    hostname: "localhost",
    routes: router.toNative(),
  });
  console.log(`Server running at ${server.url}`);
  return server;
};

if (Bun.env.NODE_ENV !== "test") {
  startServer(3000);
}

export { startServer };
