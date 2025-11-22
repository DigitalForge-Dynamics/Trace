import type { HealthCheckResponse } from "trace-schemas";
import { authenticateOidc, getOidcConfig } from "./handlers/auth.ts";
import { createRouter } from "./routes/router.ts";

const router = createRouter();

router.get(
  "/health-check",
  (): Response => Response.json({ health: "OK" } satisfies HealthCheckResponse, { status: 200 }),
);
router.post("/auth/oidc", ({ req }) => authenticateOidc(req));
router.get("/auth/oidc/config", getOidcConfig);

const startServer = (port: number): ReturnType<typeof Bun.serve> => {
  const server = Bun.serve({
    port,
    hostname: "127.0.0.1",
    fetch: router.fetch,
  });
  console.log(`Server running at ${server.url}`);
  return server;
};

if (Bun.env.NODE_ENV !== "test") {
  startServer(3000);
}

export { startServer };
