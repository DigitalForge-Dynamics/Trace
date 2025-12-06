import { createRemoteJWKSet, decodeJwt, type GenerateKeyPairResult, type JWTPayload, jwtVerify, SignJWT } from "jose";
import { JWTClaimValidationFailed, JWTExpired } from "jose/errors";
import type { oidcConfigResponse } from "trace-schemas";
import type { z } from "zod";
import { db } from "../db.ts";

const authenticateOidc = async (req: Request, signingJwks: GenerateKeyPairResult): Promise<Response> => {
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
  const requestedIdp = await db.findIdp(requestedIssuer);
  if (requestedIdp === null) {
    return Response.json({ message: "Unknown Token issuer" }, { status: 401 });
  }

  // Verify Token against issuer
  const { jwks_uri } = await fetch(new URL(".well-known/openid-configuration", `${requestedIdp.issuer}/`)).then(
    (configReq) => configReq.json(),
  );
  const jwks = createRemoteJWKSet(new URL(jwks_uri));
  let payload: JWTPayload & Required<Pick<JWTPayload, "iss" | "aud" | "sub" | "iat">>;
  try {
    const result = await jwtVerify<JWTPayload & Required<Pick<JWTPayload, "iss" | "aud" | "sub" | "iat">>>(jwt, jwks, {
      audience: requestedIdp.audience,
      requiredClaims: ["iss", "sub", "iat"],
    });
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

  const user = await db.findUser(requestedIdp.issuer, payload.sub);
  if (user === null) {
    return Response.json({ message: "Unknown user" }, { status: 403 });
  }

  // Return generated user token
  const token = await genToken(user, signingJwks.privateKey);
  return Response.json({ message: "Authenticated", data: payload, user, token }, { status: 200 });
};

const genToken = (user: object, privateKey: CryptoKey): Promise<string> =>
  new SignJWT({
    user,
  })
    .setProtectedHeader({ alg: "ES256" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .setIssuer("http://localhost:3000/auth/oidc")
    .setAudience(["trace"])
    .sign(privateKey);

const getOidcConfig = async (): Promise<Response> => {
  const idps = await db.listIdps();
  const config = idps.map((idp) => ({
    issuer: idp.issuer.toString(),
    audience: idp.audience,
    label: idp.label,
    uid: idp.uid,
  }));
  return Response.json({ config } satisfies z.input<typeof oidcConfigResponse>);
};

export { authenticateOidc, getOidcConfig };
