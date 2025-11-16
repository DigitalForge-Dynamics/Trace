import type { HealthCheckResponse } from "trace-schemas";
import { authenticateOidc } from "./handlers/auth.ts";
import { Router } from "./routes/native.ts";

const router = new Router();

router.get(
  "/health-check",
  (): Response => Response.json({ health: "OK" } satisfies HealthCheckResponse, { status: 200 }),
);
router.post("/auth/oidc", authenticateOidc);

const startServer = (port: number): ReturnType<typeof Bun.serve> => {
  const server = Bun.serve({
    port,
    hostname: "127.0.0.1",
    routes: router.toNative(),
  });
  console.log(`Server running at ${server.url}`);
  return server;
};

if (Bun.env.NODE_ENV !== "test") {
  startServer(3000);
}

export { startServer };
