import { serve } from "bun";
import { authenticateOidc } from "./handlers/auth.ts";
import { createRouter } from "./routes/router.ts";

const packageName = "trace-api";

const router = createRouter();

router.get("/health-check", () => new Response("I am the health-check endpoint"));

const server = serve({
  port: 3000,
  routes: {
    "/auth/oidc": authenticateOidc,
  },
  fetch: router.fetch,
});

console.log(`Server running at ${server.url}`);

export { packageName };
