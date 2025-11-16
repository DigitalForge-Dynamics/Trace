import { createRemoteJWKSet, type JWTPayload, jwtDecrypt, jwtVerify } from "jose";
import type { oidcConfigResponse } from "trace-schemas";
import type { z } from "zod";
import { oidcConfig } from "../config.ts";

const authenticateOidc = async (req: Request): Promise<Response> => {
  const HeaderPrefix = "Bearer ";
  const header = req.headers.get("authorization");
  if (!header) {
    return Response.json({ message: "Missing Authorization" }, { status: 401 });
  }
  if (!header.startsWith(HeaderPrefix)) {
    return Response.json({ message: "Unexpected format" }, { status: 401 });
  }
  const jwt = header.substring(HeaderPrefix.length);
  const unverified = await jwtDecrypt<JWTPayload & Required<Pick<JWTPayload, "iss">>>(
    jwt,
    {},
    { requiredClaims: ["iss"] },
  );
  const requestedIdp = oidcConfig.find((idp) => idp.issuer.toString() === unverified.payload.iss);
  if (requestedIdp === undefined) {
    return Response.json({ message: "Unknown Token issuer" }, { status: 401 });
  }
  const jwks = createRemoteJWKSet(new URL("/.well-known/jwks", requestedIdp.issuer));
  const { payload } = await jwtVerify<JWTPayload & Required<Pick<JWTPayload, "iss" | "aud" | "sub" | "iat" | "nbf">>>(
    jwt,
    jwks,
    {
      issuer: requestedIdp.issuer.toString(),
      audience: requestedIdp.audience,
      requiredClaims: ["sub", "iat", "nbf"],
    },
  );
  if (!new RegExp(requestedIdp.subject).test(payload.sub)) {
    return Response.json({ message: "Unauthorised", sub: payload.sub }, { status: 403 });
  }
  // TODO: Generate User Token, and return in request.
  return Response.json({ message: "Authenticated", data: payload }, { status: 200 });
};

const getOidcConfig = (): Response => {
  const config = oidcConfig.map((idpConfig) => ({
    issuer: idpConfig.issuer.toString(),
    audience: idpConfig.audience,
    label: idpConfig.label,
  }));
  return Response.json({ config } satisfies z.input<typeof oidcConfigResponse>);
};

export { authenticateOidc, getOidcConfig };
