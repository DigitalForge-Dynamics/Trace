import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";

const app = new Hono();

app.get('/openapi', openAPISpecs(app, {
    documentation: {
        info: {
            title: "Trace",
            version: '0.0.1-Alpha'
        },
        servers: [{ url: "http://localhost:3000" }]
    }
}));

app.get("/docs", Scalar({ theme: "saturn", url: "/openapi" }))

export default {
    port: 3000,
    fetch: app.fetch
}