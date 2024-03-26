import { Response, Request, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import AuthService from "../services/AuthenticationService";
import { UserAttributes } from "../utils/types/attributeTypes";
import { GenericClaimStructure } from "../utils/types/authenticationTypes";

export const authenticateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const requiredKey = new AuthService().getJWTSecretKey();

  if (!authHeader) {
    res.status(401).end();
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).end();
    return;
  }
  jwt.verify(token, requiredKey, { audience: "urn:trace-consumer" }, (error: VerifyErrors | null, user) => {
    if (error !== null) {
      res.status(403).end();
      return;
    }
    res.locals.user = user as UserAttributes & GenericClaimStructure;
    next();
    return;
  });
};
