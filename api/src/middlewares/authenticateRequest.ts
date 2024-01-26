import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, "123", (error, user) => {
      if (error) {
        res.status(403).end();
        return;
      }
      req.query.user = user;
      next();
    });
    return;
  } else {
    res.status(401).end();
    return;
  }
};
