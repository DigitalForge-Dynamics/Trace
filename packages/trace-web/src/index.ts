import { renderToReadableStream } from "react-dom/server";
import { Router } from "trace-router";
import { App } from "./App.tsx";

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

router.get("/oidc-manager.js", serveJs("oidc-manager.ts"));
router.get("/oidc-callback", async () => {
  const srcFile = Bun.file("./src/oidc-callback.html");
  const text = await srcFile.text();
  return new Response(text, { headers: { "Content-Type": srcFile.type } });
});

router.get("/favicon.ico", async () => {
  const assetFile = Bun.file("./assets/favicon-32x32.png");
  const contents = await assetFile.text();
  return new Response(contents, { headers: { "Content-Type": assetFile.type } });
});

router.get("/hydrate.js", serveJs("hydrate.tsx"));
router.get("/", async () => {
  const stream = await renderToReadableStream(App(), {
    bootstrapModules: ["/hydrate.js"],
  });
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
