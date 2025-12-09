// biome-ignore assist/source/organizeImports: These are organised but biome is still not happy.
import { renderToReadableStream } from "react-dom/server";
import { Router } from "trace-router";

import { LoginPage } from "./pages/LoginPage/index.tsx";
import { Dashboard } from "./pages/Dashboard/index.tsx";

const serveJs = (filename: string) => async (): Promise<Response> => {
  const buildRes = await Bun.build({
    entrypoints: [`./src/${filename}`],
    target: "browser",
    splitting: false,
    sourcemap: "inline",
    minify: {
      identifiers: true,
      syntax: true,
      whitespace: true,
    },
  });
  const script = buildRes.outputs[0];
  if (!script || buildRes.outputs.length !== 1) {
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
  const text = await script.text();
  return new Response(text, { headers: { "Content-Type": script.type } });
};

const router: Router<Record<string, never>> = new Router();

router.get("/config.js", serveJs("./config.ts"));
router.get(
  "/oidc-callback",
  () =>
    new Response(Bun.file("./src/oidc-callback.html"), {
      headers: { "Content-Type": "text/html" },
    })
);
router.get("/login/hydrate.js", serveJs("./pages/LoginPage/hydrate.tsx"));
router.get("/login", async () => {
  const stream = await renderToReadableStream(LoginPage(), {
    bootstrapModules: ["/login/hydrate.js"],
  });
  return new Response(stream, { headers: { "Content-Type": "text/html" } });
});

router.get("/login/cookie", (req) => {
  const auth = req.headers.get("Authorization");
  if (auth) {
    // TODO: Conduct Token Verification
    req.cookies.set("Authorization", auth);
    // biome-ignore lint/plugin/response-json: JSON is unintuitive outside of API.
    return new Response(null, {
      headers: {
        location: "/",
        "Access-Control-Allow-Origin": "*",
      },
      status: 307,
    });
  }
  return Response.json({ message: "Missing Token" }, { status: 401 });
});

router.middleware((req) => {
  if (req.cookies.has("Authorization")) {
    // TODO: Conduct Token Verification
    return null;
  }
  // biome-ignore lint/plugin/response-json: JSON is unintuitive outside of API.
  return new Response(null, {
    headers: {
      location: "/login",
      "Access-Control-Allow-Origin": "*",
    },
    status: 307,
  });
});

router.get("/", (req) => {
  const username = JSON.parse(req.cookies.get("Authorization") ?? "{}").user
    .username;
  const contents = `
<!DOCTYPE html>
<html>
<body>
Welcome ${username}
</body>
</html>
	`;
  return new Response(contents, { headers: { "Content-Type": "text/html" } });
});

router.get("/trace-logo.png", async () => {
  const logoPath = new URL("./assets/trace-icon.png", import.meta.url);
  const file = Bun.file(logoPath);
  return new Response(await file.bytes(), {
    headers: { "Content-Type": file.type },
  });
});

router.get("/global.css", async () => {
  const path = new URL("./global.css", import.meta.url);
  const css = await Bun.file(path).text();
  return new Response(css, { headers: { "Content-Type": "text/css" } });
});

router.get("/dashboard", async () => {
  const stream = await renderToReadableStream(Dashboard());
  return new Response(stream, { headers: { "Content-Type": "text/html" } });
});

Bun.serve({
  port: 5173,
  tls: {
    keyFile: "tls/server_key.pem",
    certFile: "tls/server_cert.pem",
  },
  routes: router.toNative(),
});
