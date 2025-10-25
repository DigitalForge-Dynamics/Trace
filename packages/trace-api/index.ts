import { serve } from "bun";
import { authenticateOidc } from "./src/handlers/auth.ts";

const packageName = "trace-api";

const server = serve({
  port: 3000,
  routes: {
    "/auth/oidc": authenticateOidc,
  },
});

console.log(`Listening on port ${server.port}`);

export { packageName };
