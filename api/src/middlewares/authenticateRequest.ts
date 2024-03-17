import { Response, Request, NextFunction, request } from "express";
import jwt from "jsonwebtoken";
import AuthService from "../services/AuthenticationService";

export const authenticateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const requiredKey = new AuthService().getJWTSecretKey();

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
