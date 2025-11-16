import { createRemoteJWKSet, jwtVerify, jwtDecrypt, type JWTPayload } from "jose";

const HEADER_PREFIX = "Bearer ";

const oidcConfig = [
  {
    issuer: "https://token.actions.githubusercontent.com",
    audience: "trace-api",
    subject:
      "^(repo:DigitalForge-Dynamics\/Trace:ref:refs\/heads\/[^/]+)|(repo:DigitalForge-Dynamics\/Trace:pull_request)$",
  },
];

const authenticateOidc = async (req: Request): Promise<Response> => {
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
  return Response.json({ oidcConfig });
};

export { authenticateOidc, getOidcConfig };
