import { createRemoteJWKSet, jwtVerify, jwtDecrypt, type JWTPayload } from "jose";
import type { z } from "zod";
import { oidcConfig } from "../config.ts";
import type { oidcConfigResponse } from "trace-schemas";

const authenticateOidc = async (req: Request): Promise<Response> => {
  const HEADER_PREFIX = "Bearer ";
  const header = req.headers.get("authorization");
  if (!header) {
    return Response.json({ message: "Missing Authorization" }, { status: 401 });
  }
  if (!header.startsWith(HEADER_PREFIX)) {
    return Response.json({ message: "Unexpected format" }, { status: 401 });
  }
  const jwt = header.substring(HEADER_PREFIX.length);
  const unverified = await jwtDecrypt<JWTPayload & Required<Pick<JWTPayload, "iss">>>(
    jwt,
    {},
    { requiredClaims: ["iss"] },
  );
  const requestedIdp = oidcConfig.find((idp) => idp.issuer === unverified.payload.iss);
  if (requestedIdp === undefined) {
    return Response.json({ message: "Unknown Token issuer" }, { status: 401 });
  }
  const jwks = createRemoteJWKSet(new URL("/.well-known/jwks", requestedIdp.issuer));
  const { payload } = await jwtVerify<JWTPayload & Required<Pick<JWTPayload, "iss" | "aud" | "sub" | "iat" | "nbf">>>(
    jwt,
    jwks,
    {
      issuer: requestedIdp.issuer,
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

const getOidcConfig = async (): Promise<Response> => {
  const config = oidcConfig.map((idpConfig) => ({
    issuer: idpConfig.issuer,
    audience: idpConfig.audience,
    label: idpConfig.label,
  }));
  return Response.json({ config } satisfies z.input<typeof oidcConfigResponse>);
};

export { authenticateOidc, getOidcConfig };
