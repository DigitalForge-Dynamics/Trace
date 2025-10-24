import { authenticateOidc } from "./src/handlers/auth";

export const packageName = "trace-api";

Bun.serve({
	port: 3000,
	routes: {
		"/auth/oidc": authenticateOidc,
	},
});
