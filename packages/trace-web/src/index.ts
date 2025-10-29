import { renderToReadableStream } from "react-dom/server";
import { App } from "./App.tsx";
import { metadata } from "./oidc-manager.ts";

const serveJs = (filename: string) => async (): Promise<Response> => {
  const buildRes = await Bun.build({
    entrypoints: [`./src/${filename}`],
    target: "browser",
    splitting: true,
    sourcemap: "inline",
    minify: {
      identifiers: true,
      syntax: true,
      whitespace: true,
    },
  });
  const script = buildRes.outputs[0];
  if (!script) {
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
  const text = await script.text();
  return new Response(text, { headers: { "Content-Type": script.type } });
};

Bun.serve({
  port: 5173,
  tls: {
    keyFile: "tls/server_key.pem",
    certFile: "tls/server_cert.pem",
  },
  routes: {
    "/oidc-callback": async () => {
      const srcFile = Bun.file("./src/oidc-callback.html");
      const contents = await srcFile.text();
      return new Response(contents, { headers: { "Content-Type": srcFile.type } });
    },
    "/oidc-token": async (req: Request) => {
      console.log("req", req);

      const newUrl = new URL(req.url);
      newUrl.hostname = new URL(metadata.token_endpoint).hostname;
      newUrl.pathname = new URL(metadata.token_endpoint).pathname;
      newUrl.port = new URL(metadata.token_endpoint).port;
      console.log("newUrl", newUrl);

      const newReq = new Request(newUrl, req);
      newReq.headers.set("referer", "https://localhost:5173/");
      console.log("newReq", newReq);

      const response = await fetch(newReq);
      console.log("response", response);

      return response;
    },
    "/favicon.ico": async () => {
      const assetFile = Bun.file("./assets/favicon-32x32.png");
      const contents = await assetFile.text();
      return new Response(contents, { headers: { "Content-Type": assetFile.type } });
    },
    "/oidc-manager.js": serveJs("oidc-manager.ts"),
    "/hydrate.js": serveJs("hydrate.tsx"),
    "/": async () => {
      const stream = await renderToReadableStream(App(), {
        bootstrapModules: ["/hydrate.js"],
      });
      return new Response(stream, { headers: { "Content-Type": "text/html" } });
    },
  },
});
