import { Response, Request, NextFunction } from "express";
import { jwtVerify } from "jose";
import AuthService from "../services/AuthenticationService";
import { TokenPayload } from "../utils/types/authenticationTypes";

export const authenticateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const requiredKey = new Uint8Array(new Buffer(new AuthService().getJWTSecretKey(), "base64"));

  if (!authHeader) {
    res.status(401).end();
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).end();
    return;
  }
  try {
  	const claims = await jwtVerify(token, requiredKey, { audience: "urn:trace-consumer" });
	res.locals.user = claims.payload as TokenPayload;
	next();
  } catch (error) {
  	console.error(error);
  	res.status(403).end();
  }
};
