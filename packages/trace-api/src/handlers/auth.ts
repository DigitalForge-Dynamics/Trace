import { jwtVerify, createRemoteJWKSet } from "jose";

const HEADER_PREFIX = "Bearer ";

// OIDC Configuration
const ISSUER = "https://token.actions.githubusercontent.com";
const AUDIENCE = "trace-api";
const SUBJECT = /^repo:DigitalForge-Dynamics\/Trace:ref:refs\/heads\/[^/]+$/;

export const authenticateOidc = async (req: Request) => {
	try {
		const header = req.headers.get("authorization");
		if (!header) return Response.json({ message: "Missing Authorization" }, { status: 401 });
		if (!header.startsWith(HEADER_PREFIX)) return Response.json({ message: "Unexpected format" }, { status: 401 });
		const jwt = header.substring(HEADER_PREFIX.length);
		const jwks = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks`));
		const { payload } = await jwtVerify(jwt, jwks, {
			issuer: ISSUER,
			audience: AUDIENCE,
			requiredClaims: ["sub", "iat", "nbf", "repository"],
		});
		if (!payload.sub) return Response.json({ message: "Internal Server Error" }, { status: 500 });
		if (!SUBJECT.test(payload.sub)) {
			return Response.json({ message: "Unauthorised" }, { status: 403 });
		}
		// TODO: Generate User Token, and return in request.
		return Response.json({ message: "Authenticated", data: payload }, { status: 200 });
	} catch (error) {
		console.error(error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
};
