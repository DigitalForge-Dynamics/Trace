import { Response, Request, NextFunction } from "express";
import { Scope, UserAttributes } from "../utils/types/attributeTypes";

export const authoriseRequest = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  // & unknown to indicate possible presence of other data. Does not affect typing, only documentative.
  const user: (UserAttributes & unknown) | undefined = res.locals.user;
  if (!user) {
    // Set within authenticateRequest middleware
    console.log("authoriseRequest middleware called before authenticateRequest middleware");
    res.status(500).end();
    return;
  }
  const requiredScopes: Scope[] | undefined = res.locals.required_scopes;
  const userScopes: Scope[] = user.scopes;

  if (requiredScopes === undefined) {
    console.log("Path does not have any required scopes defined. If no scopes are required, explicitly require an empty array.");
    res.status(500).end();
    return;
  }

  for (const required of requiredScopes) {
    if (!userScopes.includes(required)) {
      res.status(403).end();
      return;
    }
  }

  next();
};
