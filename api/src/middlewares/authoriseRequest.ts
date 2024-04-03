import { Response, Request, NextFunction } from "express";
import { Scope } from "../utils/types/attributeTypes";
import Logger from "../utils/Logger";
import { TokenPayload, TokenUse } from "../utils/types/authenticationTypes";

export const authoriseRequest = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const user: TokenPayload | undefined = res.locals.user;
  const requiredScopes: Scope[] | undefined = res.locals.required_scopes;

  if (!user) {
    // Set within authenticateRequest middleware
    Logger.error("Missing user within authoriseRequest from authenticateRequest.");
    res.status(500).end();
    return;
  }
  if (user.token_use !== TokenUse.Access) {
    Logger.error(`Invalid token_use: ${user.token_use} provided. Expected access.`);
    res.status(401).end();
    return;
  }
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
