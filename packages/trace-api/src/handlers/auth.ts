import { createRemoteJWKSet, decodeJwt, type JWTPayload, jwtVerify } from "jose";
import { JWTClaimValidationFailed, JWTExpired } from "jose/errors";
import type { oidcConfigResponse } from "trace-schemas";
import type { z } from "zod";
import { oidcConfig } from "../config.ts";

const authenticateOidc = async (req: Request): Promise<Response> => {
  // Load Token
  const HeaderPrefix = "Bearer ";
  const header = req.headers.get("authorization");
  if (!header) {
    return Response.json({ message: "Missing Authorization" }, { status: 401 });
  }
  if (!header.startsWith(HeaderPrefix)) {
    return Response.json({ message: "Unexpected format" }, { status: 401 });
  }
  const jwt = header.substring(HeaderPrefix.length);

  // Select Issuer
  const unverified = await decodeJwt<Required<Pick<JWTPayload, "isf">>>(jwt);
  if (!unverified.iss) {
    return Response.json({ message: "Missing issuer" }, { status: 401 });
  }
  if (!URL.canParse(unverified.iss)) {
    return Response.json({ message: "Invalid issuer" }, { status: 401 });
  }
  const requestedIssuer = new URL(unverified.iss);
  const requestedIdp = oidcConfig.find((idp) => idp.issuer.toString() === requestedIssuer.toString());
  if (requestedIdp === undefined) {
    return Response.json({ message: "Unknown Token issuer" }, { status: 401 });
  }

  // Verify Token against issuer
  const jwks = createRemoteJWKSet(new URL("/.well-known/jwks", requestedIdp.issuer));
  let payload: JWTPayload & Required<Pick<JWTPayload, "iss" | "aud" | "sub" | "iat" | "nbf">>;
  try {
    const result = await jwtVerify<JWTPayload & Required<Pick<JWTPayload, "iss" | "aud" | "sub" | "iat" | "nbf">>>(
      jwt,
      jwks,
      {
        audience: requestedIdp.audience,
        requiredClaims: ["iss", "sub", "iat", "nbf"],
      },
    );
    payload = result.payload;
  } catch (err) {
    if (err instanceof JWTClaimValidationFailed) {
      return Response.json({ message: "Failed validation" }, { status: 401 });
    }
    if (err instanceof JWTExpired) {
      return Response.json({ message: "Token Expired" }, { status: 401 });
    }
    throw err;
  }

  // Verify user restrictions
  if (!new RegExp(requestedIdp.subject).test(payload.sub)) {
    return Response.json({ message: "Unauthorised", sub: payload.sub }, { status: 403 });
  }

  // Return generated user token
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
