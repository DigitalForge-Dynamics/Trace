import { Response, Request, NextFunction } from "express";
import { Scope, UserAttributes } from "../utils/types/attributeTypes";
import Logger from "../utils/Logger";

export const authoriseRequest = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  // & unknown to indicate possible presence of other data. Does not affect typing, only documentative.
  const user: (UserAttributes & unknown) | undefined = res.locals.user;
  if (!user) {
    // Set within authenticateRequest middleware
    Logger.error("Missing user within authoriseRequest from authenticateRequest.");
    res.status(500).end();
    return;
  }
  const requiredScopes: Scope[] | undefined = res.locals.required_scopes;
  const userScopes: Scope[] = user.scope;

  if (requiredScopes === undefined) {
    Logger.error("No required_scopes defined for route.");
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
