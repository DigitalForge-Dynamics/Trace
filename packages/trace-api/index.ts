import { authenticateOidc } from "./src/handlers/auth.ts";

export const packageName = "trace-api";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/auth/oidc": authenticateOidc,
  },
});

console.log(`Listening on port ${server.port}`);
