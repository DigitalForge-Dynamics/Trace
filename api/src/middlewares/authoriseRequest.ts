import { Response, Request, NextFunction } from "express";
import { Scope, UserAttributes } from "../utils/types/attributeTypes";
import Logger from "../utils/Logger";
import { GenericClaimStructure, TokenUse } from "../utils/types/authenticationTypes";

export const authoriseRequest = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const user: (UserAttributes & GenericClaimStructure) | undefined = res.locals.user;
  const requiredScopes: Scope[] | undefined = res.locals.required_scopes;
  const token_type: TokenUse | undefined = res.locals.token_type;

  if (!user) {
    // Set within authenticateRequest middleware
    Logger.error("Missing user within authoriseRequest from authenticateRequest.");
    res.status(500).end();
    return;
  }
  const userScopes: Scope[] = user.scope;

  if (requiredScopes === undefined) {
    Logger.error("No required_scopes defined for route.");
    res.status(500).end();
    return;
  }

  if (token_type === undefined) {
    Logger.error("No token_type specified for route.");
    res.status(500).end();
    return;
  }

  if (token_type !== user.token_use) {
    Logger.error("Unexpected token type provided.");
    res.status(403).end();
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
