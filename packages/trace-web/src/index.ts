import { createRemoteJWKSet, type JWTPayload, jwtVerify } from "jose";
import { renderToReadableStream } from "react-dom/server";
import { Router } from "trace-router";
import type { APIClient } from "trace-sdk";
import { API_URL } from "./config.ts";
import { LoginPage } from "./pages/LoginPage/index.tsx";

type OIDCResponse = Awaited<ReturnType<typeof APIClient.prototype.authenticateOidc>>;
const jwks: ReturnType<typeof createRemoteJWKSet> = createRemoteJWKSet(
  new URL("./auth/oidc/.well-known/jwks", API_URL),
);

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

type HeaderVerification =
  | { valid: false; info: "Missing Authentication" }
  | { valid: false; info: "Invalid Token" }
  | { valid: true; token: string; payload: JWTPayload & OIDCResponse };

const verifyAuthToken = async (header: string | null): Promise<HeaderVerification> => {
  if (!header) {
    return { valid: false, info: "Missing Authentication" };
  }
  const token = header.startsWith("Bearer ") ? header.substring("Bearer ".length) : header;
  try {
    const { payload } = await jwtVerify<OIDCResponse>(token, jwks);
    return { valid: true, token, payload };
  } catch {
    return { valid: false, info: "Invalid Token" };
  }
};

const router: Router<Record<string, never>> = new Router();

router.get("/config.js", serveJs("./config.ts"));
router.get(
  "/oidc-callback",
  () => new Response(Bun.file("./src/oidc-callback.html"), { headers: { "Content-Type": "text/html" } }),
);
router.get("/login/hydrate.js", serveJs("./pages/LoginPage/hydrate.tsx"));
router.get("/login", async () => {
  const stream = await renderToReadableStream(LoginPage(), {
    bootstrapModules: ["/login/hydrate.js"],
  });
  return new Response(stream, { headers: { "Content-Type": "text/html" } });
});

router.get("/login/cookie", async (req) => {
  const verification = await verifyAuthToken(req.headers.get("Authorization"));
  if (!verification.valid) {
    return Response.json({ message: verification.info }, { status: 401 });
  }
  req.cookies.set("Authorization", verification.token);
  // biome-ignore lint/plugin/response-json: JSON is unintuitive outside of API.
  return new Response(null, {
    headers: {
      location: "/",
      "Access-Control-Allow-Origin": "*",
    },
    status: 307,
  });
});

router.middleware(async (req) => {
  const verification = await verifyAuthToken(req.cookies.get("Authorization"));
  if (verification.valid) {
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

router.get("/", async (req) => {
  const verification = await verifyAuthToken(req.cookies.get("Authorization"));
  if (!verification.valid) {
    throw new Error("Should have been caught by middleware. TODO: Inter-stack state.");
  }
  const { username } = verification.payload.user;

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

Bun.serve({
  port: 5173,
  tls: {
    keyFile: "tls/server_key.pem",
    certFile: "tls/server_cert.pem",
  },
  routes: router.toNative(),
});
