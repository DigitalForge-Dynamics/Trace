import { serve } from "bun";
import { authenticateOidc } from "./handlers/auth.ts";
import { createRouter } from "./routes/router.ts";

const packageName = "trace-api";

const router = createRouter();

router.get("/health-check", (): Response => Response.json({ health: "OK" }, { status: 200 }));

const server = serve({
  port: 3000,
  routes: {
  	"/auth/oidc": {
		POST: authenticateOidc,
	}
  },
  fetch: router.fetch,
});

console.log(`Server running at ${server.url}, on port ${server.port}`);

export { packageName };
