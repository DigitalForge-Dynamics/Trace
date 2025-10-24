import { serve } from "bun";
import { createRouter } from "./routes/router";

export const packageName = "trace-api";

const router = createRouter();

router.get("/health-check", () => {
  return new Response("I am the health-check endpoint");
});

const server = serve({
  port: 3000,
  fetch: router.fetch,
});

console.log(`Server running at ${server.url}`);
