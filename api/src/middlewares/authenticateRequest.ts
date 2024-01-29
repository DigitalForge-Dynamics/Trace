import { Response, Request, NextFunction, request } from "express";
import { RequiredKeyType, retrieveKeyPair } from "../utils/tokenService";
import jwt from "jsonwebtoken";

export const authenticateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const requiredKey = await retrieveKeyPair(RequiredKeyType.publicKey);

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, requiredKey, (error, user) => {
      if (error) {
        res.status(403).end();
        return;
      }
      req.query.user = user;
      next();
      return;
    });
  } else {
    res.status(401).end();
    return;
  }
};
