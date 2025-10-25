import { serve } from "bun";
import { authenticateOidc } from "./handlers/auth.ts";
import { createRouter } from "./routes/router.ts";

const router = createRouter();

router.get("/health-check", (): Response => Response.json({ health: "OK" }, { status: 200 }));
router.post("/auth/oidc", ({ req }) => authenticateOidc(req));

const server = (port: number): ReturnType<typeof serve> => {
  const server = serve({
    port,
	hostname: "localhost",
    fetch: router.fetch,
  });
  console.log(`Server running at ${server.url}`);
  return server;
};

export { server };
