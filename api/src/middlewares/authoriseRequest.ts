import { Response, Request, NextFunction } from "express";
import { Scope, UserAttributes } from "../utils/types/attributeTypes";
import { getRequiredScopes } from "../utils/RBAC";

export const authoriseRequest = async (
  req: Request,
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
	const userScopes: Scope[] = user.scopes;

	const requiredScopes: Scope[] | null = getRequiredScopes(req.path);

	if (requiredScopes === null) {
		console.log("Path does not have any required scopes defined. If no scopes are required, explicitly require an empty array.");
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
