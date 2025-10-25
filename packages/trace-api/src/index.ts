import { server } from "./server.ts";

if (process.env.NODE_ENV !== "test") {
	server(3000);
}

export { server };
