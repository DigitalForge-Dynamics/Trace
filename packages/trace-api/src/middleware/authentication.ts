import { jwtVerify } from "jose";

const authenticateRequest = async (req: Request, jwksPublic: CryptoKey): Promise<Response | null> => {
  try {
    // biome-ignore lint/security/noSecrets: String literal is not a secret
    const token = req.headers.get("Authorization")?.substring("Bearer ".length);
    if (!token) {
      throw new Error("Missing Token");
    }
    await jwtVerify(token, jwksPublic);
    return null;
  } catch {
    // biome-ignore lint/security/noSecrets: String literal is not a secret
    return Response.json({ message: "Unauthorised" }, { status: 401 });
  }
};

export { authenticateRequest };
