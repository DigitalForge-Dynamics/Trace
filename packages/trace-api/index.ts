import { serve } from "bun";
import { authenticateOidc } from "./src/handlers/auth.ts";

const packageName = "trace-api";

const server = serve({
  port: 3000,
  routes: {
    "/auth/oidc": {
		POST: authenticateOidc,
	},
	"/health": {
		GET: () => Response.json({ health: "OK" }, { status: 200 }),
	},
  },
});

console.log(`Listening on port ${server.port}`);

export { packageName };
