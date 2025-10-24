import { jwtVerify, createRemoteJWKSet } from "jose";

const HEADER_PREFIX = "Bearer ";
const ISSUER = "https://token.actions.githubusercontent.com";
//const AUDIENCE = "https:///github.com/DigitalDynamics/Trace";

export const authenticateOidc = async (req: Request) => {
	try {
		const header = req.headers.get("authorization");
		if (!header) return Response.json({ message: "Missing Authorization" }, { status: 401 });
		if (!header.startsWith(HEADER_PREFIX)) return Response.json({ message: "Unexpected format" }, { status: 401 });
		const jwt = header.substring(HEADER_PREFIX.length);
		const jwks = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks`));
		const { payload } = await jwtVerify(jwt, jwks, {
			//issuer: ISSUER,
			//audience: AUDIENCE,
		});
		return Response.json({ message: "Authenticated", data: payload }, { status: 200 });
	} catch (error) {
		return Response.json({ error }, { status: 500 });
	}
};
